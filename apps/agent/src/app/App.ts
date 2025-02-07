import * as easymidi from 'easymidi'
import { generateRawSysex, parseMidiInput, AgentMidi } from '@midi-structor/core'
import { Router } from './Router'
import { Agent } from './Agent'
import { Controller } from './controller/Controller'

console.log('Starting agent ...')

const MIDI_DEVICE_NAME = 'MIDI Structor Agent'
const MIDI_INPUT_NAME = `${MIDI_DEVICE_NAME} Input`
const MIDI_OUTPUT_NAME = `${MIDI_DEVICE_NAME} Output`

const errorResponse = (error: string): Uint8Array => generateRawSysex(AgentMidi.json({ error }))

const successResponse = (result: any): Uint8Array => generateRawSysex(AgentMidi.json(result))

const run = () => {
  const input = new easymidi.Input(MIDI_INPUT_NAME, true)
  const output = new easymidi.Output(MIDI_OUTPUT_NAME, true)

  input.on('sysex', (sysex) => {
    const midi = parseMidiInput({ data: sysex.bytes })
    Router.route(midi)
      .then((result) => {
        // console.log('Successful output', result)
        output.send('sysex', successResponse(result) as any as Array<number>)
      })
      .catch((error) => {
        console.error('Error routing', error)
        output.send('sysex', errorResponse(error) as any as Array<number>)
      })
  })

  console.log(`Listening to Midi input [${MIDI_INPUT_NAME}] ...`)
  console.log()

  Agent.run()
  Controller.run()
}

export const App = {
  run,
}
