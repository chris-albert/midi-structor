import { AgentMidi, MidiMessageWithRaw, parseMidiInput, SysExMessage } from '@midi-structor/core'
import { Either, pipe } from 'effect'
import { Routes } from './Routes'

const parseSysEx = (raw: MidiMessageWithRaw): Either.Either<SysExMessage, string> => {
  if (raw.type === 'sysex') {
    return Either.right(raw)
  } else {
    return Either.left(`Invalid SysEx message [${raw}]`)
  }
}

const route = (raw: MidiMessageWithRaw): Either.Either<any, string> => {
  console.log(`Routing message`, raw)

  return pipe(raw, parseSysEx, Either.flatMap(AgentMidi.parse), Either.flatMap(Routes.handle))
}

export const Router = {
  route,
}
