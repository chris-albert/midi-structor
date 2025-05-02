import React from 'react'
import { ControllerWidget } from '../ControllerWidget'
import { MidiTarget } from '../../midi/MidiTarget'
import { ProjectHooks } from '../../project/ProjectHooks'
import { Color } from '../Color'
import { Schema } from 'effect'

export const TimeSigWidget = ControllerWidget.of({
  name: 'time-signature',
  schema: Schema.Struct({
    target: MidiTarget.Schema,
  }),
  targets: (w) => [w.target],
  component: ({ target }) => {
    const timeSig = ProjectHooks.useTimeSignature()
    return (
      <pad
        color={Color.BLACK}
        target={target}
        options={{
          label: `${timeSig.noteCount}/${timeSig.noteLength}`,
        }}
      />
    )
  },
})
