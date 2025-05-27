import React from 'react'
import { Color } from '../Color'
import { Midi } from '../../midi/GlobalMidi'
import { ProjectHooks } from '../../project/ProjectHooks'
import { Pad } from '../pads/Pad'
import { TX_MESSAGE } from '../../project/AbletonUIMessage'
import { ControllerWidget } from '../ControllerWidget'
import { Schema } from 'effect'

export const LoopControlWidget = ControllerWidget.one({
  name: 'loop-control',
  schema: Schema.Struct({
    color: Color.Schema,
  }),
  init: () => ({
    color: Color.GREEN,
  }),
  component: ({ target, color }) => {
    const dawEmitter = Midi.useDawEmitter()
    const loopState = ProjectHooks.useLoopState()

    return (
      <Pad
        isFlashing={loopState}
        color={color}
        target={target}
        onClick={() =>
          dawEmitter.send(TX_MESSAGE.loop(!ProjectHooks.getLoopState()))
        }
      />
    )
  },
})
