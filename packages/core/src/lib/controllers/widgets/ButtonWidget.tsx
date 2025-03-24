import React from 'react'
import { ControllerWidget } from '../ControllerWidget'
import { MidiTarget } from '../../midi/MidiTarget'
import { Color } from '../Color'
import { Midi } from '../../midi/GlobalMidi'
import { Schema } from 'effect'
import { Pad } from '../pads/Pad'

export const ButtonWidget = ControllerWidget({
  name: 'button',
  schema: Schema.TaggedStruct('button', {
    target: MidiTarget.Schema,
    color: Color.Schema,
    isFlashing: Schema.Boolean,
    message: MidiTarget.Schema,
  }),
  targets: (w) => [w.target],
  component: ({ target, color, isFlashing, message }) => {
    const dawEmitter = Midi.useDawEmitter()

    return (
      <Pad
        isFlashing={isFlashing}
        color={color}
        target={target}
        onClick={() => dawEmitter.send(MidiTarget.toMessage(message, 127))}
      />
    )
  },
})
