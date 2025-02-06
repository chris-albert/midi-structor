import { AgentMidi, MidiMessageWithRaw, SysExMessage } from '@midi-structor/core'
import { pipe, Effect, Either } from 'effect'
import { Routes } from './Routes'

const parseSysEx = (raw: MidiMessageWithRaw): Promise<SysExMessage> => {
  if (raw.type === 'sysex') {
    return Promise.resolve(raw)
  } else {
    return Promise.reject(`Invalid SysEx message [${raw}]`)
  }
}

const route = (raw: MidiMessageWithRaw): Promise<any> => {
  return parseSysEx(raw)
    .then((msg) =>
      Either.match(AgentMidi.parse(msg), {
        onLeft: (error) => Promise.reject(error),
        onRight: (value) => Promise.resolve(value),
      }),
    )
    .then(Routes.handle)
}

export const Router = {
  route,
}
