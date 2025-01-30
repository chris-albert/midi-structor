import { MidiDevices, MidiDevice } from '@midi-structor/core'

const mapToArray = (map: any): Array<any> => {
  const arr: Array<any> = []
  map.forEach((v: any) => {
    arr.push(v)
  })

  return arr
}

const buildWindowMidi = (access: any): MidiDevices => {
  return {
    isAllowed: true,
    inputs: mapToArray(access.inputs).map(MidiDevice.buildInputDevice),
    outputs: mapToArray(access.outputs).map(MidiDevice.buildOutputDevice),
  }
}

export function getMidiAccess(sysex = false): Promise<MidiDevices> {
  const navigator: any = window.navigator
  return typeof window !== 'undefined' && navigator && typeof navigator.requestMIDIAccess === 'function'
    ? navigator.requestMIDIAccess({ sysex }).then(buildWindowMidi)
    : new Promise((resolve, reject) => reject(new Error('MIDI Not Available')))
}

export default getMidiAccess
