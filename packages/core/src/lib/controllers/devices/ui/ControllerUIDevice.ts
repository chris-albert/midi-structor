import React from 'react'
import { ControllerWidget } from '../../ControllerWidget'
import { MIDIStructorUIWidgets } from '../MIDIStructorUI'
import { UIStore } from './UIStore'
import { ControllerDevice } from '../ControllerDevice'
import { ConfiguredController } from '../../ConfiguredController'

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
