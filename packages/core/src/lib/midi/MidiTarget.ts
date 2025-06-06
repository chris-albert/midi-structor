import { Data, Schema } from 'effect'
import { MidiMessage } from './MidiMessage'
import { SchemaForm } from '../controllers/widgets/form/SchemaForm'

export type MidiTarget = Data.TaggedEnum<{
  Note: { note: number }
  CC: { controllerNumber: number }
  PC: { programNumber: number }
}>

const _MidiTarget = Data.taggedEnum<MidiTarget>()

const MidiTargetSchema = Schema.Union(
  Schema.TaggedStruct('Note', {
    note: Schema.Number,
  }),
  Schema.TaggedStruct('CC', {
    controllerNumber: Schema.Number,
  }),
  Schema.TaggedStruct('PC', {
    programNumber: Schema.Number,
  })
).annotations(SchemaForm.annotation('MidiTarget'))

const notes = ({
  from,
  to,
}: {
  from: number
  to: number
}): Array<MidiTarget> => {
  const arr: Array<MidiTarget> = []
  for (let i = from; i <= to; i++) {
    arr.push(note(i))
  }
  return arr
}

const ccs = ({ from, to }: { from: number; to: number }): Array<MidiTarget> => {
  const arr: Array<MidiTarget> = []
  for (let i = from; i <= to; i++) {
    arr.push(cc(i))
  }
  return arr
}

const note = (note: number): MidiTarget => _MidiTarget.Note({ note })
const cc = (controllerNumber: number): MidiTarget =>
  _MidiTarget.CC({ controllerNumber })
const pc = (programNumber: number): MidiTarget =>
  _MidiTarget.PC({ programNumber })

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

const allCCs: Array<MidiTarget> = Array.from({ length: 127 }).map((_, i) =>
  cc(i)
)
const allNotes: Array<MidiTarget> = Array.from({ length: 127 }).map((_, i) =>
  note(i)
)
const allTargets: Array<MidiTarget> = [...allCCs, ...allNotes]

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
  ccs,
  pc,
  toKey,
  toMessage,
  toValue,
  allTargets,
  match: _MidiTarget.$match,
  Schema: MidiTargetSchema,
}
