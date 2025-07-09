import React from 'react'
import { Color } from '../Color'
import { TX_MESSAGE } from '../../project/AbletonUIMessage'
import { Pad } from '../pads/Pad'
import { ProjectHooks } from '../../project/ProjectHooks'
import { ControllerWidget } from '../ControllerWidget'
import { Schema } from 'effect'
import { DawMidi } from '../../midi/DawMidi'

export const MetronomeControlWidget = ControllerWidget.one({
  name: 'metronome-control',
  schema: Schema.Struct({
    color: Color.Schema,
  }),
  init: () => ({
    color: Color.BLUE,
  }),
  component: ({ target, color }) => {
    const dawEmitter = DawMidi.useDawEmitter()
    const metronomeState = ProjectHooks.useMetronomeState()

    return (
      <Pad
        isFlashing={metronomeState}
        color={color}
        target={target}
        onClick={() =>
          dawEmitter.send(
            TX_MESSAGE.metronome(!ProjectHooks.getMetronomeState())
          )
        }
        options={{ metronomeState }}
      />
    )
  },
})
