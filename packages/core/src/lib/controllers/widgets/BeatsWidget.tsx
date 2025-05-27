import React from 'react'
import _ from 'lodash'
import { Color } from '../Color'
import { ProjectHooks } from '../../project/ProjectHooks'
import { ControllerWidget } from '../ControllerWidget'
import { Schema } from 'effect'

const color = (
  beat: number,
  index: number,
  oneColor: Color,
  restColor: Color
): Color => {
  const padBeat = index + 1
  if (padBeat <= beat) {
    return padBeat === 1 ? oneColor : restColor
  } else {
    return Color.BLACK
  }
}

export const BeatsWidget = ControllerWidget.many({
  name: 'beats',
  schema: Schema.Struct({
    oneColor: Color.Schema,
    restColor: Color.Schema,
  }),
  init: () => ({
    oneColor: Color.GREEN,
    restColor: Color.RED,
  }),
  component: ({ targets, oneColor, restColor }) => {
    const beat = ProjectHooks.useBarBeats()
    const timeSignature = ProjectHooks.useTimeSignature()

    const pads = _.map(targets, (target, index) => (
      <pad
        key={`beat-${index}`}
        color={color(beat, index, oneColor, restColor)}
        target={target}
        options={{ timeSignature }}
      />
    ))

    return <>{pads}</>
  },
})
