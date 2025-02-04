import React from 'react'
import _ from 'lodash'
import { Color } from '../Color'
import { MidiTarget } from '../../midi/MidiTarget'
import { ProjectHooks } from '../../project/ProjectHooks'

type BeatsWidgetProps = {
  targets: Array<MidiTarget>
}

const color = (beat: number, index: number): Color => {
  const padBeat = index + 1
  if (padBeat <= beat) {
    return padBeat === 1 ? Color.GREEN : Color.RED
  } else {
    return Color.BLACK
  }
}

export const BeatsWidget: React.FC<BeatsWidgetProps> = ({ targets }) => {
  const beat = ProjectHooks.useBarBeats()

  const pads = _.map(targets, (target, index) => (
    <pad
      key={`beat-${index}`}
      color={color(beat, index)}
      target={target}
    />
  ))

  return <>{pads}</>
}
