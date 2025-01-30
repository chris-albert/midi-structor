import { MidiOutput, MidiInput } from '@midi-structor/core'

export type WindowMidi = {
  isAllowed: boolean
  inputs: Array<MidiInput>
  outputs: Array<MidiOutput>
}

const empty: WindowMidi = {
  isAllowed: false,
  inputs: [],
  outputs: [],
}

export const WindowMidi = {
  empty,
}
