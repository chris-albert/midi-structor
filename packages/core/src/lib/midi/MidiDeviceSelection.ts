import { Schema } from 'effect'

const MidiDeviceType = Schema.Union(
  Schema.Literal('input'),
  Schema.Literal('output')
)
export type MidiDeviceType = typeof MidiDeviceType.Type

export type MidiDeviceSelection = {
  type: MidiDeviceType
  devices: Array<string>
  setSelected: (name: string | undefined) => void
  selected: string | undefined
}

export const MidiDeviceSelection = {}
