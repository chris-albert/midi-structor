import _ from 'lodash'
import { Either, Schema, Option } from 'effect'
import { ParseError } from 'effect/ParseResult'

const CHANNEL_MASK = 0x0f

const SYSEX_STATUS = 0xf0
const NOTE_ON_STATUS = 0x09
const NOTE_OFF_STATUS = 0x08
const CONTROL_CHANGE_STATUS = 0x0b
const PROGRAM_CHANGE_STATUS = 0x0c

const MTC_QUARTER_FRAME_STATUS = 0xf1
const TIMING_CLOCK_STATUS = 0xf8
const MEASURE_END_STATUS = 0xf9
const START_STATUS = 0xfa
const CONTINUE_STATUS = 0xfb
const STOP_STATUS = 0xfc
const ACTIVE_SENSING_STATUS = 0xfe
const RESET_STATUS = 0xff

export const MidiChannel = Schema.Struct({
  channel: Schema.Number,
})
export type MidiChannel = Schema.Schema.Type<typeof MidiChannel>

export const SysExMessage = Schema.Struct({
  type: Schema.Literal('sysex'),
  manufacturer: Schema.Number,
  body: Schema.Array(Schema.Number),
})

export type SysExMessage = Schema.Schema.Type<typeof SysExMessage>

export const NoteOnMessage = Schema.Struct({
  type: Schema.Literal('noteon'),
  note: Schema.Number,
  velocity: Schema.Number,
  ...MidiChannel.fields,
})

export type NoteOnMessage = Schema.Schema.Type<typeof NoteOnMessage>

export const NoteOffMessage = Schema.Struct({
  type: Schema.Literal('noteoff'),
  note: Schema.Number,
  velocity: Schema.Number,
  ...MidiChannel.fields,
})

export type NoteOffMessage = Schema.Schema.Type<typeof NoteOffMessage>

export const ControlChangeMessage = Schema.Struct({
  type: Schema.Literal('cc'),
  controllerNumber: Schema.Number,
  data: Schema.Number,
  ...MidiChannel.fields,
})

export type ControlChangeMessage = Schema.Schema.Type<
  typeof ControlChangeMessage
>

export const ProgramChangeMessage = Schema.Struct({
  type: Schema.Literal('pc'),
  programNumber: Schema.Number,
  ...MidiChannel.fields,
})

export type ProgramChangeMessage = Schema.Schema.Type<
  typeof ProgramChangeMessage
>

export const ClockMessage = Schema.Struct({
  type: Schema.Literal('clock'),
})
export type ClockMessage = Schema.Schema.Type<typeof ClockMessage>

export const MeasureEndMessage = Schema.Struct({
  type: Schema.Literal('measureend'),
})
export type MeasureEndMessage = Schema.Schema.Type<typeof MeasureEndMessage>

export const StartMessage = Schema.Struct({
  type: Schema.Literal('start'),
})
export type StartMessage = Schema.Schema.Type<typeof StartMessage>

export const ContinueMessage = Schema.Struct({
  type: Schema.Literal('continue'),
})
export type ContinueMessage = Schema.Schema.Type<typeof ContinueMessage>

export const StopMessage = Schema.Struct({
  type: Schema.Literal('stop'),
})
export type StopMessage = Schema.Schema.Type<typeof StopMessage>

export const ResetMessage = Schema.Struct({
  type: Schema.Literal('reset'),
})
export type ResetMessage = Schema.Schema.Type<typeof ResetMessage>

export const ActiveSensingMessage = Schema.Struct({
  type: Schema.Literal('activesensing'),
})
export type ActiveSensingMessage = Schema.Schema.Type<
  typeof ActiveSensingMessage
>

export const MTCQuarterFrameMessage = Schema.Struct({
  type: Schema.Literal('mtcquarterframe'),
  data: Schema.Number,
})
export type MTCQuarterFrameMessage = Schema.Schema.Type<
  typeof MTCQuarterFrameMessage
>

export const UnknownMessage = Schema.Struct({
  type: Schema.Literal('unknown'),
})
export type UnknownMessage = Schema.Schema.Type<typeof UnknownMessage>

export const ErrorMessage = Schema.Struct({
  type: Schema.Literal('error'),
  message: Schema.String,
})
export type ErrorMessage = Schema.Schema.Type<typeof ErrorMessage>

export const Message = Schema.Union(
  SysExMessage,
  NoteOnMessage,
  NoteOffMessage,
  ControlChangeMessage,
  ProgramChangeMessage,
  ClockMessage,
  MeasureEndMessage,
  StartMessage,
  ContinueMessage,
  StopMessage,
  ResetMessage,
  ActiveSensingMessage,
  MTCQuarterFrameMessage,
  UnknownMessage,
  ErrorMessage
)

export type MidiMessage = Schema.Schema.Type<typeof Message>
export type MidiMessageWithRaw = MidiMessage & {
  raw: Uint8Array
  time: Date
}

export const parseMidiInput = (input: any): MidiMessage => {
  if (input.data !== undefined) {
    const data: Uint8Array = input.data
    const status = data[0]
    if (status !== undefined) {
      if (status === SYSEX_STATUS) {
        return {
          ...parseRawSysex(data.slice(1, -1)),
        }
      } else if (status >> 4 === NOTE_ON_STATUS) {
        return {
          type: 'noteon',
          channel: (CHANNEL_MASK & status) + 1,
          note: data[1] as number,
          velocity: data[2] as number,
        }
      } else if (status >> 4 === NOTE_OFF_STATUS) {
        return {
          type: 'noteoff',
          channel: (CHANNEL_MASK & status) + 1,
          note: data[1] as number,
          velocity: data[2] as number,
        }
      } else if (status >> 4 === CONTROL_CHANGE_STATUS) {
        return {
          type: 'cc',
          channel: (CHANNEL_MASK & status) + 1,
          controllerNumber: data[1] as number,
          data: data[2] as number,
        }
      } else if (status >> 4 === PROGRAM_CHANGE_STATUS) {
        return {
          type: 'pc',
          channel: (CHANNEL_MASK & status) + 1,
          programNumber: data[1] as number,
        }
      } else if (status === TIMING_CLOCK_STATUS) {
        return {
          type: 'clock',
        }
      } else if (status === MEASURE_END_STATUS) {
        return {
          type: 'measureend',
        }
      } else if (status === START_STATUS) {
        return {
          type: 'start',
        }
      } else if (status === CONTINUE_STATUS) {
        return {
          type: 'continue',
        }
      } else if (status === STOP_STATUS) {
        return {
          type: 'stop',
        }
      } else if (status === RESET_STATUS) {
        return {
          type: 'reset',
        }
      } else if (status === ACTIVE_SENSING_STATUS) {
        return {
          type: 'activesensing',
        }
      } else if (status === MTC_QUARTER_FRAME_STATUS) {
        return {
          type: 'mtcquarterframe',
          data: data[1] as number,
        }
      } else {
        return {
          type: 'unknown',
        }
      }
    } else {
      return {
        type: 'unknown',
      }
    }
  }
  return {
    type: 'error',
    message: 'No data in MIDI message',
  }
}

const parseRawSysex = (data: Uint8Array): SysExMessage => {
  const contents = data.slice(1) as any as Array<number>

  return {
    type: 'sysex',
    manufacturer: data[0] as number,
    body: contents,
  }
}

const generateRawSysex = (sysex: SysExMessage): Uint8Array => {
  const arr = [0xf0, sysex.manufacturer]
  const withBody = arr.concat(sysex.body)
  withBody.push(0xf7)
  return withBody as any as Uint8Array
}

export const generateRawMidiMessage = (message: MidiMessage): Uint8Array => {
  if (message.type === 'sysex') {
    return generateRawSysex(message)
  } else if (message.type === 'noteon' || message.type === 'noteoff') {
    return generateNoteMessage(message)
  } else if (message.type === 'cc') {
    return generateControlChange(message)
  } else if (message.type === 'pc') {
    return generateProgramChange(message)
  } else {
    return [] as any as Uint8Array
  }
}

const generateNoteMessage = (
  message: NoteOnMessage | NoteOffMessage
): Uint8Array => {
  const status = message.type === 'noteon' ? NOTE_ON_STATUS : NOTE_OFF_STATUS
  const arr = [
    (status << 4) + (message.channel - 1),
    message.note,
    message.velocity,
  ]

  return arr as any as Uint8Array
}

const generateControlChange = (message: ControlChangeMessage): Uint8Array => {
  const arr = [
    (CONTROL_CHANGE_STATUS << 4) + (message.channel - 1),
    message.controllerNumber,
    message.data,
  ]

  return arr as any as Uint8Array
}

const generateProgramChange = (message: ProgramChangeMessage): Uint8Array => {
  const arr = [
    (PROGRAM_CHANGE_STATUS << 4) + (message.channel - 1),
    message.programNumber,
  ]

  return arr as any as Uint8Array
}

const charCodesFromString = (
  str: string,
  prefix: Array<number>
): Array<number> => {
  const codes: Array<number> = [...prefix]
  _.forEach(str, (s, i) => {
    codes.push(str.charCodeAt(i))
  })
  return codes
}

const sysex = (body: Array<number>, manufacturer = 0): SysExMessage => ({
  type: 'sysex',
  manufacturer,
  body,
})

const jsonSysex = (
  msg: any,
  prefix: Array<number> = [],
  manufacturer = 0
): SysExMessage =>
  sysex(charCodesFromString(JSON.stringify(msg), prefix), manufacturer)

const jsonSchemaSysex = <A, B>(
  msg: A,
  schema: Schema.Schema<A, B>,
  prefix: Array<number> = [],
  manufacturer = 0
): SysExMessage =>
  sysex(
    charCodesFromString(
      Option.match(Schema.encodeOption(schema)(msg), {
        onSome: (c) => JSON.stringify(c),
        onNone: () => 'Error encoding schema sysex',
      }),
      prefix
    ),
    manufacturer
  )

const stringFromCharCodes = (codes: Array<number>): string => {
  const strs: Array<string> = []
  _.forEach(codes, (code) => {
    strs.push(String.fromCharCode(code))
  })
  return strs.join('')
}

const parseJsonSysex = <A, B>(
  sysex: SysExMessage,
  schema: Schema.Schema<A, B>,
  skipControl = 0
): Either.Either<A, ParseError> => {
  const str = stringFromCharCodes(sysex.body.slice(skipControl))
  return Schema.decodeUnknownEither(Schema.parseJson(schema))(str)
}

const raw = (msg: MidiMessage): MidiMessageWithRaw => ({
  raw: [] as any,
  time: new Date(),
  ...msg,
})

export const MidiMessage = {
  schema: Message,
  sysex,
  jsonSysex,
  jsonSchemaSysex,
  parseJsonSysex,
  raw,
}
