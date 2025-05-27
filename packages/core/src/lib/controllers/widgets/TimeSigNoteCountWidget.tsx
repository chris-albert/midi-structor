import React from 'react'
import { Color } from '../Color'
import { ProjectHooks } from '../../project/ProjectHooks'
import { ControllerWidget } from '../ControllerWidget'
import { Schema } from 'effect'

export const TimeSigNoteCountWidget = ControllerWidget.many({
  name: 'time-sig-count',
  schema: Schema.Struct({
    color: Color.Schema,
  }),
  init: () => ({
    color: Color.BLUE,
  }),
  component: ({ targets, color }) => {
    const timeSig = ProjectHooks.useTimeSignature()
    const pads = targets.map((target, i) => (
      <pad
        key={`time-sig-count-${i}`}
        target={target}
        color={i + 1 <= timeSig.noteCount ? color : Color.BLACK}
      />
    ))
    return <>{pads}</>
  },
})
