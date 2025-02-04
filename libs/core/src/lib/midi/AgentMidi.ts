import _ from 'lodash'
import { SysExMessage } from './MidiMessage'

const MANUFACTURER_ID = 0x02

const charCodesFromString = (str: string): Array<number> => {
  const codes: Array<number> = []
  _.forEach(str, (s, i) => {
    codes.push(str.charCodeAt(i))
  })
  return codes
}

const base = (statusByte: number, body: string): SysExMessage => {
  return {
    type: 'sysex',
    manufacturer: MANUFACTURER_ID,
    statusByte,
    body: charCodesFromString(body),
  }
}

const json = (obj: object): SysExMessage => base(0x39, JSON.stringify(obj))

export const AgentMidi = {
  json,
}
