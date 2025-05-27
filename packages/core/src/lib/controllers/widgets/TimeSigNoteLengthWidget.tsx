import React from 'react'
import { Color } from '../Color'
import { ProjectHooks } from '../../project/ProjectHooks'
import { ControllerWidget } from '../ControllerWidget'
import { Schema } from 'effect'

export const TimeSigNoteLengthWidget = ControllerWidget.many({
  name: 'time-sig-length',
  schema: Schema.Struct({
    color: Color.Schema,
  }),
  init: () => ({
    color: Color.PURPLE,
  }),
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
