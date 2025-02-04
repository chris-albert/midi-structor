import { MidiMessageWithRaw, parseMidiInput, SysExMessage } from '@midi-structor/core'
import { Either } from 'effect'

const parseSysEx = (raw: MidiMessageWithRaw): Either.Either<SysExMessage, string> => {
  if (raw.type === 'sysex') {
    return Either.right(raw)
  } else {
    return Either.left(`Invalid SysEx message [${raw}]`)
  }
}

const parseJson = (sysex: SysExMessage): Either.Either<any, string> => {
  try {
    const json = JSON.parse(sysex.body.join(''))
    return Either.right(json)
  } catch (e) {
    return Either.left(`Unable to parse as JSON [${e}] [${sysex.body.join('')}]`)
  }
}

const route = (raw: MidiMessageWithRaw): Either.Either<any, string> => {
  console.log(`Routing message`, raw)
  return Either.left('Error!!!!')
}

export const Router = {
  route,
}
