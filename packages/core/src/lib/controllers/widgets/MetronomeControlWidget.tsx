import React from 'react'
import { MidiTarget } from '../../midi/MidiTarget'
import { Color } from '../Color'
import { Midi } from '../../midi/GlobalMidi'
import { TX_MESSAGE } from '../../project/AbletonUIMessage'
import { Pad } from '../pads/Pad'
import { ProjectHooks } from '../../project/ProjectHooks'
import { ControllerWidget } from '../ControllerWidget'
import { Schema } from 'effect'

export const MetronomeControlWidget = ControllerWidget({
  name: 'metronome-control',
  schema: Schema.TaggedStruct('metronome-control', {
    target: MidiTarget.Schema,
    color: Color.Schema,
  }),
  targets: (w) => [w.target],
  component: ({ target, color }) => {
    const dawEmitter = Midi.useDawEmitter()
    const metronomeState = ProjectHooks.useMetronomeState()

    return (
      <Pad
        isFlashing={metronomeState}
        color={color}
        target={target}
        onClick={() => dawEmitter.send(TX_MESSAGE.metronome(!ProjectHooks.getMetronomeState()))}
      />
    )
  },
})
