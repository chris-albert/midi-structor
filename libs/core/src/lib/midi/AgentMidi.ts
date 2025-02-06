import _ from 'lodash'
import { SysExMessage } from './MidiMessage'
import { Either, Schema, pipe } from 'effect'
import { AgentMessage, GetDevicesMessage } from '../agent/Messages'

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

const json = (obj: any): SysExMessage => base(JSON.stringify(obj))

const parse = (sysex: SysExMessage): Either.Either<any, string> => {
  try {
    const body = _.map(sysex.body, (value) => String.fromCharCode(value))
    const json = JSON.parse(body.join(''))
    return Either.right(json)
  } catch (e) {
    return Either.left(`Unable to parse as JSON [${e}] [${sysex.body.join('')}]`)
  }
}

const schemaParse =
  <A>(schema: Schema.Schema<A>) =>
  (obj: any): Either.Either<A, string> =>
    Either.mapLeft(Schema.decodeUnknownEither(schema)(obj), (pe) => `Parse error ${pe.message}`)

const agentParse = (obj: any): Either.Either<AgentMessage, string> => schemaParse(AgentMessage)(obj)

const parseSchema = <A>(sysex: SysExMessage, schema: Schema.Schema<A>): Either.Either<A, string> =>
  pipe(parse(sysex), Either.flatMap(schemaParse(schema)))

const parseMessage = (sysex: SysExMessage): Either.Either<AgentMessage, string> =>
  parseSchema(sysex, AgentMessage)

const message = (msg: AgentMessage): SysExMessage => {
  return json(msg)
}

const on =
  <A>(schema: Schema.Schema<A>) =>
  (f: (a: A) => void) =>
  (sysex: SysExMessage) => {
    Either.map(parseSchema(sysex, schema), (a) => {
      f(a)
    })
  }

const getDevices = () => message(GetDevicesMessage.make({}))

export const AgentMidi = {
  on,
  json,
  parse,
  parseMessage,
  message,
  getDevices,
}
