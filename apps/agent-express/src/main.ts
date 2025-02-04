import easymidi from 'easymidi'
import { parseMidiInput } from '@midi-structor/core'

console.log('Starting agent ...')

const input = new easymidi.Input('MIDI Structor Input', true)
const output = new easymidi.Output('MIDI Structor Output', true)

input.on('sysex', (sysex) => {
  const res = parseMidiInput(sysex.bytes)
  console.log('res', sysex)
})
