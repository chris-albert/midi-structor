import React from 'react'
import {
  MIDIStructorUI,
  ControllerUIDevice,
  MidiStructorUIInit,
  UIMessageStore,
  MidiMessage,
  UIStore,
  MidiStructorSysexControlCodes,
  SysExMessage,
} from '@midi-structor/core'
import { MidiStructorComponent } from './MidiStructorComponent'
import { atomFamily } from 'jotai/utils'
import { atom, useAtomValue, useSetAtom } from 'jotai'
import { Either } from 'effect'

type MIDIStructorMessage = typeof MidiStructorUIInit.Type
type MIDIStructorStore = UIMessageStore<MIDIStructorMessage>

const atomStore = atomFamily((name: string) => atom<MIDIStructorStore>({}))

const parseInit = (sysex: SysExMessage): any => {
  return Either.match(MidiMessage.parseJsonSysex(sysex, MidiStructorUIInit, 1), {
    onRight: (m) => m,
    onLeft: (parseError) => {
      console.error('Error parsing MIDIStructor UI widgets', parseError)
      return {}
    },
  })
}

const useStore: UIStore<MIDIStructorMessage> = (name) => {
  const setStore = useSetAtom(atomStore(name))
  return {
    usePut: () => (m: MidiMessage) => {
      if (m.type === 'sysex') {
        if (m.body[0] === MidiStructorSysexControlCodes.init) {
          setStore((s) => ({ ...s, init: parseInit(m) }))
        }
      }
    },
    useGet: () => useAtomValue(atomStore(name)),
  }
}

export const MIDIStructorDeviceUI = ControllerUIDevice.of({
  controller: MIDIStructorUI.device,
  component: (configuredController, device) => {
    return (
      <MidiStructorComponent
        configuredController={configuredController}
        device={device}
      />
    )
  },
  useStore,
})

export type MIDIStructorDeviceUI = typeof MIDIStructorDeviceUI
