import React from 'react'
import { Color } from '../Color'
import { Midi } from '../../midi/GlobalMidi'
import { TX_MESSAGE } from '../../project/AbletonUIMessage'
import { Pad } from '../pads/Pad'
import { ProjectHooks } from '../../project/ProjectHooks'
import { ControllerWidget } from '../ControllerWidget'
import { Schema } from 'effect'

export const MetronomeControlWidget = ControllerWidget.one({
  name: 'metronome-control',
  schema: Schema.Struct({
    color: Color.Schema,
  }),
  init: () => ({
    color: Color.BLUE,
  }),
  component: ({ target, color }) => {
    const dawEmitter = Midi.useDawEmitter()
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
