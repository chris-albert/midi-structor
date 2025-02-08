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
    try {
      const midiMessage = parseMidiInput({ data: rawMessage.bytes })
      emitter.emit(midiMessage)
    } catch (e) {
      console.error(`Parsing midi error`, e)
    }
  })

  return emitter
}

const buildEmitter = (name: string) => (): MidiEmitter => {
  const output = new easymidi.Output(name)
  return {
    send: (msg: MidiMessage) => {
      try {
        // console.debug('Sending midi message', msg)
        if (msg.type === 'sysex') {
          const raw = generateRawMidiMessage(msg)
          output.send('sysex', raw as any as Array<number>)
        } else if (msg.type === 'noteon') {
          output.send('noteon', {
            note: msg.note,
            velocity: msg.velocity,
            channel: msg.channel as easymidi.Channel,
          })
        } else if (msg.type === 'noteoff') {
          output.send('noteoff', {
            note: msg.note,
            velocity: msg.velocity,
            channel: msg.channel as easymidi.Channel,
          })
        } else if (msg.type === 'cc') {
          output.send('cc', {
            controller: msg.controllerNumber,
            value: msg.data,
            channel: msg.channel as easymidi.Channel,
          })
        } else if (msg.type === 'pc') {
          output.send('program', {
            number: msg.programNumber,
            channel: msg.channel as easymidi.Channel,
          })
        }
      } catch (e) {
        console.error('Error sending midi message', e)
      }
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
