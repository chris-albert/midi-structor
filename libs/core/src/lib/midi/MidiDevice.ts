import {
  EventEmitter,
  EventRecord,
  generateRawMidiMessage,
  MidiMessage,
  MidiMessageWithRaw,
  parseMidiInput,
} from '@midi-structor/core'

export type MidiPort = {
  type: 'input' | 'output'
  id: string
  name: string
  manufacturer: string
  onstatechange: (i: any) => void
  state: 'connected' | 'disconnected'
  connection: 'open' | 'closed' | 'pending'
  version: string
}

export type MidiMessageType = MidiMessage['type'] | '*'

export type MidiEventRecord = EventRecord<MidiMessageWithRaw>

export type MidiInput = MidiPort & {
  type: 'input'
} & Omit<EventEmitter<MidiEventRecord>, 'emit'>

export type MidiOutput = MidiPort & {
  type: 'output'
  send: (i: MidiMessage) => void
}

const buildInputDevice = (input: any): MidiInput => {
  const emitter = EventEmitter<MidiEventRecord>()
  input.onmidimessage = (rawMessage: any) => {
    const midiMessage = parseMidiInput(rawMessage)
    emitter.emit(midiMessage)
  }

  return {
    id: input.id,
    name: input.name,
    manufacturer: input.manufacturer,
    onstatechange: input.onstatechange,
    state: input.state,
    connection: input.connection,
    version: input.version,
    type: 'input',
    on: emitter.on,
  }
}

const buildOutputDevice = (output: any): MidiOutput => {
  return {
    id: output.id,
    name: output.name,
    manufacturer: output.manufacturer,
    onstatechange: output.onstatechange,
    state: output.state,
    connection: output.connection,
    version: output.version,
    type: 'output',
    send: (msg: MidiMessage) => {
      const raw = generateRawMidiMessage(msg)
      console.debug('Sending midi message', raw)
      output.send(raw)
    },
  }
}

export type MidiDevices = {
  isAllowed: boolean
  inputs: Array<MidiInput>
  outputs: Array<MidiOutput>
}

const empty: MidiDevices = {
  isAllowed: false,
  inputs: [],
  outputs: [],
}

export const MidiDevice = {
  empty,
  buildInputDevice,
  buildOutputDevice,
}
