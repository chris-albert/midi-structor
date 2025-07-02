import { Option } from 'effect'
import { MidiListener } from './MidiListener'
import { MidiEmitter } from './MidiEmitter'

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
}
