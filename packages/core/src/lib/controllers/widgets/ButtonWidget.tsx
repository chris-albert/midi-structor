import React from 'react'
import { ControllerWidget } from '../ControllerWidget'
import { Color } from '../Color'
import { Schema } from 'effect'
import { Pad } from '../pads/Pad'
import { DawMidi } from '../../midi/DawMidi'
import { SchemaForm } from './form/SchemaForm'

export const TextSchema = Schema.optional(
  Schema.Struct({
    content: Schema.String,
    color: Schema.optional(Color.Schema),
    sizePx: Schema.optional(Schema.Number),
  })
).annotations(SchemaForm.annotation('Text'))

export type TextSchema = Schema.Schema.Type<typeof TextSchema>

export const ButtonWidget = ControllerWidget.one({
  name: 'button',
  schema: Schema.Struct({
    color: Color.Schema,
    isFlashing: Schema.Boolean.annotations(SchemaForm.annotation('Switch')),
    midi: SchemaForm.Schemas.Midi,
    text: TextSchema,
  }),
  init: () => ({
    color: Color.GREEN,
    isFlashing: false,
    midi: [],
  }),
  component: ({ target, color, isFlashing, midi }) => {
    const dawEmitter = DawMidi.useDawEmitter()

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
