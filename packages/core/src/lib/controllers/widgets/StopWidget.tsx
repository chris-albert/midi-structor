import React from 'react'
import { Color } from '../Color'
import { MidiTarget } from '../../midi/MidiTarget'
import { Midi } from '../../midi/GlobalMidi'
import { TX_MESSAGE } from '../../project/AbletonUIMessage'
import { ControllerWidget } from '../ControllerWidget'
import { Schema } from 'effect'

export const StopWidget = ControllerWidget({
  name: 'stop',
  schema: Schema.Struct({
    target: MidiTarget.Schema,
    color: Color.Schema,
  }),
  targets: (w) => [w.target],
  component: ({ target, color }) => {
    const dawEmitter = Midi.useDawEmitter()

    return (
      <pad
        color={color}
        target={target}
        onClick={() => dawEmitter.send(TX_MESSAGE.stop())}
      />
    )
  },
})
