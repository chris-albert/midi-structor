import {
  Midi,
  EventEmitter,
  parseMidiInput,
  MidiMessage,
  generateRawMidiMessage,
  MidiEventRecord,
  MidiDeviceManager,
  MidiListener,
  MidiEmitter,
  ControllerMidi,
} from '@midi-structor/core'
import React from 'react'
import _ from 'lodash'
import { Option } from 'effect'
import { AllControllerUIDevices } from '../components/controller/devices/AllControllerUIDevices'

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
      console.debug('Sending midi message', raw, msg)
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

export function getMidiAccess(sysex = false): Promise<MidiDeviceManager> {
  const navigator: any = window.navigator
  return typeof window !== 'undefined' &&
    navigator &&
    typeof navigator.requestMIDIAccess === 'function'
    ? navigator.requestMIDIAccess({ sysex }).then(buildMidiDeviceManager)
    : new Promise((resolve, reject) => reject(new Error('MIDI Not Available')))
}

const useAccess = () => {
  React.useEffect(() => {
    getMidiAccess(true)
      .then((manager) => {
        Midi.init(manager)
        AllControllerUIDevices.init()
        ControllerMidi.init()
      })
      .catch(console.error)
  }, [])
}

export const MidiAccess = {
  useAccess,
}
