import { MidiMessage } from './MidiMessage'
import {
  EventEmitter,
  EventEmitterWithBroadcast,
  EventRecord,
} from '../EventEmitter'

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

export type MidiEventEmitter = EventEmitter<MidiEventRecord>
export type MidiEventEmitterWithBroadcast =
  EventEmitterWithBroadcast<MidiEventRecord>

export type MidiInput = MidiPort & {
  type: 'input'
} & Omit<EventEmitter<MidiEventRecord>, 'emit'>

export type MidiOutput = MidiPort & {
  type: 'output'
  send: (i: MidiMessage) => void
}
