import React from 'react'
import { ControllerWidget } from '../ControllerWidget'
import { Color } from '../Color'
import { Schema } from 'effect'
import { ProjectHooks } from '../../project/ProjectHooks'

export const SoftRefreshWidget = ControllerWidget.one({
  name: 'soft-refresh',
  schema: Schema.Struct({
    color: Color.Schema,
  }),
  init: () => ({
    color: Color.PURPLE,
  }),
  component: ({ target, color }) => {
    const refreshControllers = ProjectHooks.useRefreshProject()
    return (
      <pad
        color={color}
        target={target}
        onClick={() => {
          refreshControllers()
        }}
      />
    )
  },
})
