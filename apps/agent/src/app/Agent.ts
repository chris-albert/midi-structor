import {
  EventEmitter,
  generateRawMidiMessage,
  Midi,
  MidiDeviceManager,
  MidiEmitter,
  MidiEventRecord,
  MidiListener,
  MidiMessage,
  parseMidiInput,
} from '@midi-structor/core'
import * as easymidi from 'easymidi'
import { Option } from 'effect'
import _ from 'lodash'

const buildListener = (name: string) => (): MidiListener => {
  const emitter = EventEmitter<MidiEventRecord>()
  const input = new easymidi.Input(name)
  input.on('sysex', (rawMessage: any) => {
    const midiMessage = parseMidiInput(rawMessage)
    emitter.emit(midiMessage)
  })
  return emitter
}

const buildEmitter = (name: string) => (): MidiEmitter => {
  const output = new easymidi.Output(name)
  return {
    send: (msg: MidiMessage) => {
      const raw = generateRawMidiMessage(msg)
      console.debug('Sending midi message', raw)
      // output.send(raw)
    },
  }
}

const getManager = (): MidiDeviceManager => {
  const inputs = _.fromPairs(easymidi.getInputs().map((name) => [name, buildListener(name)]))
  const outputs = _.fromPairs(easymidi.getOutputs().map((name) => [name, buildEmitter(name)]))

  return {
    isAllowed: true,
    inputs: _.keys(inputs),
    outputs: _.keys(outputs),
    getInput: (name: string) => Option.map(Option.fromNullable(inputs[name]), (l) => l()),
    getOutput: (name: string) => Option.map(Option.fromNullable(outputs[name]), (e) => e()),
  }
}

const run = () => {
  console.log('Running Agent...')

  Midi.init(getManager())
}

export const Agent = {
  run,
}
