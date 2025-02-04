import * as easymidi from 'easymidi'
import { parseMidiInput } from '@midi-structor/core'

console.log('Starting agent ...')

const MIDI_DEVICE_NAME = 'MIDI Structor'
const MIDI_INPUT_NAME = `${MIDI_DEVICE_NAME} Input`
const MIDI_OUTPUT_NAME = `${MIDI_DEVICE_NAME} Output`

const input = new easymidi.Input(MIDI_INPUT_NAME, true)
const output = new easymidi.Output(MIDI_OUTPUT_NAME, true)

const insertStatusSeparator = (data: Array<number>): Array<number> => [
  ...data.slice(0, 3),
  0x01,
  ...data.slice(3),
]

input.on('sysex', (sysex) => {
  const res = parseMidiInput({ data: insertStatusSeparator(sysex.bytes) })
  console.log('res', res)
})

console.log(`Listening to Midi input [${MIDI_INPUT_NAME}] ...`)
console.log()
