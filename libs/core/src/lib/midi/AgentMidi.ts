import _ from 'lodash'
import { SysExMessage } from './MidiMessage'
import { Either } from 'effect'
import { AgentMessage } from '../agent/Messages'

const MANUFACTURER_ID = 0x02

const charCodesFromString = (str: string): Array<number> => {
  const codes: Array<number> = []
  _.forEach(str, (s, i) => {
    codes.push(str.charCodeAt(i))
  })
  return codes
}

const base = (body: string): SysExMessage => {
  return {
    type: 'sysex',
    manufacturer: MANUFACTURER_ID,
    body: charCodesFromString(body),
  }
}

const json = (obj: object): SysExMessage => base(JSON.stringify(obj))

const parse = (sysex: SysExMessage): Either.Either<any, string> => {
  try {
    const body = _.map(sysex.body, (value) => String.fromCharCode(value))
    const json = JSON.parse(body.join(''))
    return Either.right(json)
  } catch (e) {
    return Either.left(`Unable to parse as JSON [${e}] [${sysex.body.join('')}]`)
  }
}

const message = (msg: AgentMessage): SysExMessage => {
  return json(msg)
}

export const AgentMidi = {
  json,
  parse,
  message,
}
