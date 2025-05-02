import React from 'react'
import { ControllerWidget } from '../ControllerWidget'
import { MidiTarget } from '../../midi/MidiTarget'
import { ProjectHooks } from '../../project/ProjectHooks'
import { Color } from '../Color'
import { Schema } from 'effect'

export const BeatWidget = ControllerWidget.of({
  name: 'beat',
  schema: Schema.Struct({
    target: MidiTarget.Schema,
  }),
  targets: (w) => [w.target],
  component: ({ target }) => {
    const barBeat = ProjectHooks.useBarBeats()
    return (
      <pad
        color={Color.BLACK}
        target={target}
        options={{
          label: `${barBeat}`,
        }}
      />
    )
  },
})
