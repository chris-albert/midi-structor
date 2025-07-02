import { EventEmitter } from '../EventEmitter'
import { MidiEventRecord } from './MidiDevice'

export type MidiListener = Omit<EventEmitter<MidiEventRecord>, 'emit'>

const empty = (): MidiListener => ({
  on: (m) => () => {
    console.log('Empty listener', m)
  },
})

export const MidiListener = {
  empty,
}
