import { Option } from 'effect'
import { MidiListener } from './MidiListener'
import { MidiEmitter } from './MidiEmitter'
import { State } from '../state/State'
import { EventEmitter } from '../EventEmitter'
import { MidiEventRecord } from './MidiDevice'
import {
  generateRawMidiMessage,
  MidiMessage,
  parseMidiInput,
} from './MidiMessage'
import _ from 'lodash'
import { log } from '../logger/log'

export type MidiDeviceManager = {
  isAllowed: boolean
  getInput: (nane: string) => Option.Option<MidiListener>
  getOutput: (nane: string) => Option.Option<MidiEmitter>
  inputs: Array<string>
  outputs: Array<string>
}

const mapToArray = (map: any): Array<any> => {
  const arr: Array<any> = []
  map.forEach((v: any) => {
    arr.push(v)
  })

  return arr
}

const buildListener = (input: any) => (): MidiListener => {
  const emitter = EventEmitter<MidiEventRecord>()
  input.onmidimessage = (rawMessage: any) => {
    const midiMessage = parseMidiInput(rawMessage)
    emitter.emit(midiMessage)
  }
  return emitter
}

const buildEmitter = (output: any) => (): MidiEmitter => {
  return {
    send: (msg: MidiMessage) => {
      const raw = generateRawMidiMessage(msg)
      log.debug('Sending midi message', raw, msg)
      output.send(raw)
    },
  }
}

const buildMidiDeviceManager = (access: any): MidiDeviceManager => {
  const inputs = _.fromPairs(
    mapToArray(access.inputs).map((input) => [input.name, buildListener(input)])
  )
  const outputs = _.fromPairs(
    mapToArray(access.outputs).map((output) => [
      output.name,
      buildEmitter(output),
    ])
  )

  return {
    isAllowed: true,
    inputs: _.keys(inputs),
    outputs: _.keys(outputs),
    getInput: (name: string) =>
      Option.map(Option.fromNullable(inputs[name]), (l) => l()),
    getOutput: (name: string) =>
      Option.map(Option.fromNullable(outputs[name]), (e) => e()),
  }
}

const build = (sysex: boolean): Promise<MidiDeviceManager> => {
  return typeof navigator.requestMIDIAccess === 'function'
    ? navigator.requestMIDIAccess({ sysex }).then(buildMidiDeviceManager)
    : new Promise((resolve, reject) => reject(new Error('MIDI Not Available')))
}

const empty: MidiDeviceManager = {
  isAllowed: false,
  getInput: (name) => Option.none(),
  getOutput: (name) => Option.none(),
  inputs: [],
  outputs: [],
}

const states = {
  deviceManager: State.memSingle('device-manager', empty),
}

const useDeviceManager = () => states.deviceManager.useValue()

const useMidiAllowed = () => useDeviceManager().isAllowed

export const MidiDeviceManager = {
  empty,
  build,
  state: states.deviceManager,
  use: useDeviceManager,
  useMidiAllowed,
}
