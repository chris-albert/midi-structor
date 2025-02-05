import * as easymidi from 'easymidi'
import { generateRawSysex, parseMidiInput, AgentMidi } from '@midi-structor/core'
import { Router } from './Router'
import { Either } from 'effect'
import { Agent } from './Agent'

console.log('Starting agent ...')

const MIDI_DEVICE_NAME = 'MIDI Structor'
const MIDI_INPUT_NAME = `${MIDI_DEVICE_NAME} Input`
const MIDI_OUTPUT_NAME = `${MIDI_DEVICE_NAME} Output`

const errorResponse = (error: string): Uint8Array => generateRawSysex(AgentMidi.json({ error }))

const successResponse = (result: any): Uint8Array => generateRawSysex(AgentMidi.json(result))

const run = () => {
  const input = new easymidi.Input(MIDI_INPUT_NAME, true)
  const output = new easymidi.Output(MIDI_OUTPUT_NAME, true)

  input.on('sysex', (sysex) => {
    const midi = parseMidiInput({ data: sysex.bytes })
    const result = Router.route(midi)
    const body = Either.match(result, {
      onLeft: (error) => {
        console.error('Error routing', error)
        return errorResponse(error)
      },
      onRight: (output) => {
        console.log('Successful output', output)
        return successResponse(output)
      },
    })
    output.send('sysex', body as any as Array<number>)
  })

  console.log(`Listening to Midi input [${MIDI_INPUT_NAME}] ...`)
  console.log()

  Agent.run()
}

export const App = {
  run,
}
