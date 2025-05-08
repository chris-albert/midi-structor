import React from 'react'
import {
  ConfiguredController,
  ControllerDevice,
  MidiMessage,
} from '@midi-structor/core'
import { ControllerWidget } from '../../ControllerWidget'
import {
  MIDIStructorUIWidgets,
  MIDIStructorUIWidgetsUpdate,
} from '../MIDIStructorUI'

export type UIMessageStore<A> = Record<string, A>

export type UIStore<A> = (name: string) => {
  usePut: () => (m: MidiMessage) => void
  useGet: () => UIMessageStore<A>
}

export type ControllerUIDevice<A, Widgets extends Array<ControllerWidget>> = {
  controller: ControllerDevice<Widgets>
  component: (
    controller: ConfiguredController,
    device: ControllerUIDevice<A, Widgets>,
    setWidgets: (w: MIDIStructorUIWidgets) => void
  ) => React.ReactElement
  useStore: UIStore<A>
}

const of = <A, Widgets extends Array<ControllerWidget>>(
  device: Omit<ControllerUIDevice<A, Widgets>, 'useStore'> & {
    useStore?: UIStore<A>
  }
): ControllerUIDevice<A, Widgets> => ({
  useStore: device.useStore || dummyStore(),
  ...device,
})

const dummyStore =
  <A>(): UIStore<A> =>
  () => ({
    usePut: () => (m) => {},
    useGet: () => ({}),
  })

const emptyDevice: ControllerUIDevice<{}, []> = {
  controller: ControllerDevice.empty,
  component: (c: ConfiguredController) => React.createElement('div'),
  useStore: dummyStore<{}>(),
}

export const ControllerUIDevice = {
  of,
  dummyStore,
  emptyDevice,
}
