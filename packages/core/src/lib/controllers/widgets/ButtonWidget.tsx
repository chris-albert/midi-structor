import React from 'react'
import { ControllerWidget } from '../ControllerWidget'
import { MidiTarget } from '../../midi/MidiTarget'
import { Color } from '../Color'
import { Midi } from '../../midi/GlobalMidi'
import { Schema } from 'effect'
import { Pad } from '../pads/Pad'

export const ButtonWidget = ControllerWidget.of({
  name: 'button',
  schema: Schema.TaggedStruct('button', {
    target: MidiTarget.Schema,
    color: Color.Schema,
    isFlashing: Schema.Boolean,
    midi: Schema.Array(MidiTarget.Schema),
    text: Schema.optional(
      Schema.Struct({
        content: Schema.String,
        color: Schema.optional(Color.Schema),
        size: Schema.optional(Schema.String),
      })
    ),
  }),
  targets: (w) => [w.target],
  component: ({ target, color, isFlashing, midi }) => {
    const dawEmitter = Midi.useDawEmitter()

    return (
      <Pad
        isFlashing={isFlashing}
        color={color}
        target={target}
        onClick={() => {
          midi.forEach((t) => dawEmitter.send(MidiTarget.toMessage(t, 127)))
        }}
      />
    )
  },
})
