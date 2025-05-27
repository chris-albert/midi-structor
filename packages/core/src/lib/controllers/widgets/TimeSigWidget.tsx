import React from 'react'
import { ControllerWidget } from '../ControllerWidget'
import { ProjectHooks } from '../../project/ProjectHooks'
import { Color } from '../Color'
import { Schema } from 'effect'

export const TimeSigWidget = ControllerWidget.one({
  name: 'time-signature',
  schema: Schema.Struct({}),
  init: () => ({}),
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
