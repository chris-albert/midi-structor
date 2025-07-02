import { MidiMessage } from './MidiMessage'

export type MidiEmitter = {
  send: (m: MidiMessage) => void
}

const empty = (): MidiEmitter => ({
  send: (message: MidiMessage) => {
    console.debug('Empty send', message)
  },
})

export const MidiEmitter = {
  empty,
}
