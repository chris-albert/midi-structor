import React from 'react'
import {
  MIDIStructorUI,
  ControllerUIDevice,
  UIMessageStore,
  MidiMessage,
  UIStore,
  SysExMessage,
  MidiTarget,
  MidiStructorSysexControlCode,
  MIDIStructorMessage,
} from '@midi-structor/core'
import { MidiStructorComponent } from './MidiStructorComponent'
import { atomFamily } from 'jotai/utils'
import { atom, useAtomValue, useSetAtom } from 'jotai'
import { Either } from 'effect'

export type MIDIStructorStore = UIMessageStore<MIDIStructorMessage>

const atomStore = atomFamily((name: string) => atom<MIDIStructorStore>({}))

const parseMessage = (sysex: SysExMessage): any => {
  return Either.match(
    MidiMessage.parseJsonSysex(sysex, MIDIStructorMessage, 1),
    {
      onRight: (m) => {
        if (m._tag === 'init') {
          return { init: m }
        } else if (m._tag === 'pad') {
          return { [MidiTarget.toKey(m.target)]: m }
        } else {
          return {}
        }
      },
      onLeft: (parseError) => {
        console.error('Error parsing MIDIStructor UI widgets', parseError)
        return {}
      },
    }
  )
}

const useStore: UIStore<MIDIStructorMessage> = (name) => {
  const setStore = useSetAtom(atomStore(name))
  return {
    usePut: () => (m: MidiMessage) => {
      if (m.type === 'sysex') {
        if (m.body[0] === MidiStructorSysexControlCode) {
          setStore((s) => ({ ...s, ...parseMessage(m) }))
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
