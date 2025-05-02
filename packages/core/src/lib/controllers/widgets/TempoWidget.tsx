import React from 'react'
import { ControllerWidget } from '../ControllerWidget'
import { Schema } from 'effect'
import { MidiTarget } from '../../midi/MidiTarget'
import { Color } from '../Color'
import { ProjectHooks } from '../../project/ProjectHooks'

export const TempoWidget = ControllerWidget.of({
  name: 'tempo',
  schema: Schema.Struct({
    target: MidiTarget.Schema,
  }),
  targets: (w) => [w.target],
  component: ({ target }) => {
    const tempo = ProjectHooks.useTempo()
    return (
      <pad
        color={Color.BLACK}
        target={target}
        options={{
          label: tempo,
        }}
      />
    )
  },
})
