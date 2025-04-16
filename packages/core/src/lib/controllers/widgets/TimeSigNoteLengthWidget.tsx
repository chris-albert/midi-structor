import React from 'react'
import { Color } from '../Color'
import { MidiTarget } from '../../midi/MidiTarget'
import { ProjectHooks } from '../../project/ProjectHooks'
import { ControllerWidget } from '../ControllerWidget'
import { Schema } from 'effect'

export const TimeSigNoteLengthWidget = ControllerWidget({
  name: 'time-sig-length',
  schema: Schema.Struct({
    targets: Schema.Array(MidiTarget.Schema),
    color: Color.Schema,
  }),
  targets: (w) => [...w.targets],
  component: ({ targets, color }) => {
    const timeSig = ProjectHooks.useTimeSignature()
    const pads = targets.map((target, i) => (
      <pad
        key={`time-sig-length-${i}`}
        target={target}
        color={i + 1 <= timeSig.noteLength ? color : Color.BLACK}
      />
    ))
    return <>{pads}</>
  },
})
