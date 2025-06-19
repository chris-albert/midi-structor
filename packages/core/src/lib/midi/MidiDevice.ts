import {
  generateRawMidiMessage,
  MidiMessage,
  MidiMessageWithRaw,
  parseMidiInput,
} from './MidiMessage'
import { EventEmitter, EventRecord } from '../EventEmitter'

export type MidiPort = {
  type: 'input' | 'output'
  id: string
  name: string
  manufacturer: string
  onstatechange: (i: any) => void
  state: 'connected' | 'disconnected'
  connection: 'open' | 'closed' | 'pending'
  version: string
}

export type MidiMessageType = MidiMessage['type'] | '*'

export type MidiEventRecord = EventRecord<MidiMessage>

export type MidiInput = MidiPort & {
  type: 'input'
} & Omit<EventEmitter<MidiEventRecord>, 'emit'>

export type MidiOutput = MidiPort & {
  type: 'output'
  send: (i: MidiMessage) => void
}

export type MidiDevices = {
  isAllowed: boolean
  inputs: Array<MidiInput>
  outputs: Array<MidiOutput>
}

const empty: MidiDevices = {
  isAllowed: false,
  inputs: [],
  outputs: [],
}

export const MidiDevice = {
  empty,
}
