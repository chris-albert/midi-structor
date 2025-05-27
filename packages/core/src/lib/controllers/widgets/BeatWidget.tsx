import React from 'react'
import { ControllerWidget } from '../ControllerWidget'
import { ProjectHooks } from '../../project/ProjectHooks'
import { Color } from '../Color'
import { Schema } from 'effect'

export const BeatWidget = ControllerWidget.one({
  name: 'beat',
  schema: Schema.Struct({}),
  init: () => ({}),
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
