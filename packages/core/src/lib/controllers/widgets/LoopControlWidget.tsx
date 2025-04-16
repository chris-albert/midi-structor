import React from 'react'
import { MidiTarget } from '../../midi/MidiTarget'
import { Color } from '../Color'
import { Midi } from '../../midi/GlobalMidi'
import { ProjectHooks } from '../../project/ProjectHooks'
import { Pad } from '../pads/Pad'
import { TX_MESSAGE } from '../../project/AbletonUIMessage'
import { ControllerWidget } from '../ControllerWidget'
import { Schema } from 'effect'

export const LoopControlWidget = ControllerWidget.of({
  name: 'loop-control',
  schema: Schema.Struct({
    target: MidiTarget.Schema,
    color: Color.Schema,
  }),
  targets: (w) => [w.target],
  component: ({ target, color }) => {
    const dawEmitter = Midi.useDawEmitter()
    const loopState = ProjectHooks.useLoopState()

    return (
      <Pad
        isFlashing={loopState}
        color={color}
        target={target}
        onClick={() => dawEmitter.send(TX_MESSAGE.loop(!ProjectHooks.getLoopState()))}
      />
    )
  },
})
