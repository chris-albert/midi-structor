import { MidiMessage } from './MidiMessage'
import { log } from '../logger/log'

export type MidiEmitter = {
  send: (m: MidiMessage) => void
}

const empty = (): MidiEmitter => ({
  send: (message: MidiMessage) => {
    log.debug('Empty send', message)
  },
})

export const MidiEmitter = {
  empty,
}
