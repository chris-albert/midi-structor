import React from 'react'
import { ControllerWidget } from '../ControllerWidget'
import { Schema } from 'effect'
import { Color } from '../Color'
import { ProjectHooks } from '../../project/ProjectHooks'

export const TempoWidget = ControllerWidget.one({
  name: 'tempo',
  schema: Schema.Struct({}),
  init: () => ({}),
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
