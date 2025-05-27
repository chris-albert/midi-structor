import React from 'react'
import { ControllerWidget } from '../ControllerWidget'
import { Color } from '../Color'
import { Midi } from '../../midi/GlobalMidi'
import { Schema } from 'effect'
import { Pad } from '../pads/Pad'
import { MidiMessage } from '../../midi/MidiMessage'

export const ButtonWidget = ControllerWidget.one({
  name: 'button',
  schema: Schema.Struct({
    color: Color.Schema,
    isFlashing: Schema.Boolean,
    midi: Schema.Array(MidiMessage.schema),
    text: Schema.optional(
      Schema.Struct({
        content: Schema.String,
        color: Schema.optional(Color.Schema),
        size: Schema.optional(Schema.String),
      })
    ),
  }),
  init: () => ({
    color: Color.GREEN,
    isFlashing: false,
    midi: [],
  }),
  component: ({ target, color, isFlashing, midi }) => {
    const dawEmitter = Midi.useDawEmitter()

    return (
      <Pad
        isFlashing={isFlashing}
        color={color}
        target={target}
        onClick={() => {
          midi.forEach(dawEmitter.send)
        }}
      />
    )
  },
})
