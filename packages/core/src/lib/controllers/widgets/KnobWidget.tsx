import React from 'react'
import { ControllerWidget } from '../ControllerWidget'
import { MidiTarget } from '../../midi/MidiTarget'
import { Color } from '../Color'
import { MidiChannel } from '../../midi/MidiMessage'
import { Midi } from '../../midi/GlobalMidi'
import { Pad } from '../pads/Pad'
import { Schema } from 'effect'

export const MidiNoteOnVaryVelocity = Schema.TaggedStruct(
  'midi-note-vary-velocity',
  {
    note: Schema.Number,
    ...MidiChannel.fields,
  }
)

export const MidiNoteOnVaryNote = Schema.TaggedStruct('midi-note-vary-note', {
  velocity: Schema.Number,
  ...MidiChannel.fields,
})

export const MidiCCVaryData = Schema.TaggedStruct('midi-cc-vary-data', {
  controllerNumber: Schema.Number,
  ...MidiChannel.fields,
})

export const KnobMidi = Schema.Union(
  MidiNoteOnVaryNote,
  MidiNoteOnVaryVelocity,
  MidiCCVaryData
)

export const KnobWidget = ControllerWidget.of({
  name: 'knob',
  schema: Schema.Struct({
    target: MidiTarget.Schema,
    color: Color.Schema,
    midi: KnobMidi,
    text: Schema.optional(
      Schema.Struct({
        content: Schema.String,
        color: Schema.optional(Color.Schema),
        size: Schema.optional(Schema.String),
      })
    ),
  }),
  targets: (w) => [w.target],
  component: ({ target, color, midi }) => {
    const dawEmitter = Midi.useDawEmitter()

    return (
      <Pad
        color={color}
        target={target}
        onClick={() => {
          console.log('idk what to do here yet')
        }}
      />
    )
  },
})
