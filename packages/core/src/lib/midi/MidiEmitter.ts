import { MidiMessage } from './MidiMessage'
import { log } from '../logger/log'
import { EventEmitter } from '../EventEmitter'
import { MidiEventRecord } from './MidiDevice'

export type MidiEmitter = {
  send: (m: MidiMessage) => void
}

const empty = (): MidiEmitter => ({
  send: (message: MidiMessage) => {
    log.debug('Empty send', message)
  },
})

const fromEventEmitter = (
  eventEmitter: EventEmitter<MidiEventRecord>
): MidiEmitter => ({
  send: (message: MidiMessage) => {
    eventEmitter.emit(message)
  },
})

export const MidiEmitter = {
  empty,
  fromEventEmitter,
}
