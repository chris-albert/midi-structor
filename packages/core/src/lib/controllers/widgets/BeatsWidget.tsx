import React from 'react'
import _ from 'lodash'
import { Color } from '../Color'
import { MidiTarget } from '../../midi/MidiTarget'
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

export const BeatsWidget = ControllerWidget.of({
  name: 'beats',
  schema: Schema.Struct({
    targets: Schema.Array(MidiTarget.Schema),
    oneColor: Color.Schema,
    restColor: Color.Schema,
  }),
  targets: (w) => [...w.targets],
  component: ({ targets, oneColor, restColor }) => {
    const beat = ProjectHooks.useBarBeats()

    const pads = _.map(targets, (target, index) => (
      <pad
        key={`beat-${index}`}
        color={color(beat, index, oneColor, restColor)}
        target={target}
      />
    ))

    return <>{pads}</>
  },
})
