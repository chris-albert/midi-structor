import { Option } from 'effect'
import { MidiListener } from './MidiListener'
import { MidiEmitter } from './MidiEmitter'
import { State } from '../state/State'

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

const states = {
  deviceManager: State.memSingle('device-manager', empty),
}

const useDeviceManager = () => states.deviceManager.useValue()

export const MidiDeviceManager = {
  empty,
  state: states.deviceManager,
  use: useDeviceManager,
}
