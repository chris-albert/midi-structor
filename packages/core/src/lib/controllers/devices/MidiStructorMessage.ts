import { MidiTarget } from '../../midi/MidiTarget'
import { Color } from '../Color'
import { Schema } from 'effect'

export const MidiStructorUIInit = Schema.TaggedStruct('init', {
  widgets: Schema.Array(Schema.Any),
})

export const MIDIStructorPad = Schema.TaggedStruct('pad', {
  target: MidiTarget.Schema,
  color: Color.Schema,
  options: Schema.optional(Schema.Any),
})

export type MIDIStructorPad = typeof MIDIStructorPad.Type

export const MIDIStructorMessage = Schema.Union(
  MidiStructorUIInit,
  MIDIStructorPad
)
export type MIDIStructorMessage = typeof MIDIStructorMessage.Type
