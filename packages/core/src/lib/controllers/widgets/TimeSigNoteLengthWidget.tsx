import React from 'react'
import { Color } from '../Color'
import { MidiTarget } from '../../midi/MidiTarget'
import { ProjectHooks } from '../../project/ProjectHooks'

type TimeSigNoteLengthWidgetProps = {
  targets: Array<MidiTarget>
  color?: Color
}

export const TimeSigNoteLengthWidget: React.FC<TimeSigNoteLengthWidgetProps> = ({
  targets,
  color = Color.PURPLE,
}) => {
  const timeSig = ProjectHooks.useTimeSignature()
  const pads = targets.map((target, i) => (
    <pad
      key={`time-sig-length-${i}`}
      target={target}
      color={i + 1 <= timeSig.noteLength ? color : Color.BLACK}
    />
  ))
  return <>{pads}</>
}
