import React from 'react'
import { ControllerWidget } from '../ControllerWidget'
import { Color } from '../Color'
import { Schema } from 'effect'
import { ConfiguredController } from '../ConfiguredController'

export const SoftRefreshWidget = ControllerWidget.one({
  name: 'soft-refresh',
  schema: Schema.Struct({
    color: Color.Schema,
  }),
  init: () => ({
    color: Color.PURPLE,
  }),
  component: ({ target, color }) => {
    const refreshControllers = ConfiguredController.useRefreshControllers()
    return (
      <pad
        color={color}
        target={target}
        onClick={() => {
          console.log('refreshing')
          refreshControllers()
        }}
      />
    )
  },
})
