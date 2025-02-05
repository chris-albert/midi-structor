import { MidiEmitter, MidiListener } from './GlobalMidi'
import { MidiMessage } from './MidiMessage'
import { Option } from 'effect'

export const emptyEmitter = (): MidiEmitter => ({
  send: (message: MidiMessage) => {
    console.debug('Empty send', message)
  },
})

export const emptyListener = (): MidiListener => ({
  on: () => () => {},
})

export type MidiDeviceManager = {
  isAllowed: boolean
  getInput: (nane: string) => Option.Option<MidiListener>
  getOutput: (nane: string) => Option.Option<MidiEmitter>
  inputs: Array<string>
  outputs: Array<string>
}

const empty: MidiDeviceManager = {
  isAllowed: false,
  getInput: (name) => Option.none(),
  getOutput: (name) => Option.none(),
  inputs: [],
  outputs: [],
}

export const MidiDeviceManager = {
  empty,
  emptyEmitter,
  emptyListener,
}
