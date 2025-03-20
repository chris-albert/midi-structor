import React from 'react'
import _ from 'lodash'
import { Color } from '../Color'
import { MidiTarget } from '../../midi/MidiTarget'
import { ProjectHooks } from '../../project/ProjectHooks'

type BeatsWidgetProps = {
  targets: Array<MidiTarget>
  oneColor?: Color
  restColor?: Color
}

const color = (beat: number, index: number, oneColor: Color, restColor: Color): Color => {
  const padBeat = index + 1
  if (padBeat <= beat) {
    return padBeat === 1 ? Color.GREEN : Color.RED
  } else {
    return Color.BLACK
  }
}

export const BeatsWidget: React.FC<BeatsWidgetProps> = ({
  targets,
  oneColor = Color.GREEN,
  restColor = Color.RED,
}) => {
  const beat = ProjectHooks.useBarBeats()

  const pads = _.map(targets, (target, index) => (
    <pad
      key={`beat-${index}`}
      color={color(beat, index, oneColor, restColor)}
      target={target}
    />
  ))

  return <>{pads}</>
}
