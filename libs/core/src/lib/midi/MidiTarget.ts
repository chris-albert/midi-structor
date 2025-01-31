import { Data } from 'effect'
import { MidiMessage } from '@midi-structor/core'

export type MidiTarget = Data.TaggedEnum<{
  Note: { note: number }
  CC: { controllerNumber: number }
  PC: { programNumber: number }
}>

const _MidiTarget = Data.taggedEnum<MidiTarget>()

const note = (note: number): MidiTarget => _MidiTarget.Note({ note })

const notes = ({ from, to }: { from: number; to: number }): Array<MidiTarget> => {
  const arr: Array<MidiTarget> = []
  for (let i = from; i <= to; i++) {
    arr.push(note(i))
  }
  return arr
}

const cc = (controllerNumber: number): MidiTarget => _MidiTarget.CC({ controllerNumber })

const pc = (programNumber: number): MidiTarget => _MidiTarget.PC({ programNumber })

const toKey = (target: MidiTarget): string =>
  _MidiTarget.$match({
    Note: ({ note }) => `noteon-${note}`,
    CC: ({ controllerNumber }) => `cc-${controllerNumber}`,
    PC: ({ programNumber }) => `pc-${programNumber}`,
  })(target)

const toMessage = (target: MidiTarget, value: number): MidiMessage =>
  _MidiTarget.$match({
    Note: ({ note }) =>
      ({
        type: 'noteon',
        channel: 1,
        note,
        velocity: value,
      } as MidiMessage),
    CC: ({ controllerNumber }) =>
      ({
        type: 'cc',
        channel: 1,
        controllerNumber,
        data: value,
      } as MidiMessage),
    PC: () =>
      ({
        type: 'pc',
        programNumber: value,
      } as MidiMessage),
  })(target)

const toValue = (target: MidiTarget): number =>
  _MidiTarget.$match({
    Note: ({ note }) => note,
    CC: ({ controllerNumber }) => controllerNumber,
    PC: ({ programNumber }) => programNumber,
  })(target)

export const MidiTarget = {
  note,
  notes,
  cc,
  pc,
  toKey,
  toMessage,
  toValue,
  match: _MidiTarget.$match,
}
