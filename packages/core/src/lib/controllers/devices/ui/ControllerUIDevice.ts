import React from 'react'
import {
  ConfiguredController,
  ControllerDevice,
  MidiMessage,
} from '@midi-structor/core'

export type UIMessageStore<A> = Record<string, A>

export type UIStore<A> = (name: string) => {
  usePut: () => (m: MidiMessage) => void
  useGet: () => UIMessageStore<A>
}

export type ControllerUIDevice<A> = {
  controller: ControllerDevice
  component: (
    controller: ConfiguredController,
    device: ControllerUIDevice<A>
  ) => React.ReactElement
  useStore: UIStore<A>
}

const of = <A>(
  device: Omit<ControllerUIDevice<A>, 'useStore'> & { useStore?: UIStore<A> }
): ControllerUIDevice<A> => ({
  useStore: device.useStore || dummyStore(),
  ...device,
})

const dummyStore =
  <A>(): UIStore<A> =>
  () => ({
    usePut: () => (m) => {},
    useGet: () => ({}),
  })

const emptyDevice: ControllerUIDevice<{}> = {
  controller: ControllerDevice.empty,
  component: (c: ConfiguredController) => React.createElement('div'),
  useStore: dummyStore<{}>(),
}

export const ControllerUIDevice = {
  of,
  dummyStore,
  emptyDevice,
}
