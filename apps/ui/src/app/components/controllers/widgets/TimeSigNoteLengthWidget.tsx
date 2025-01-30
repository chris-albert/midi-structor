import React from 'react'
import { MidiTarget } from '../../../midi/MidiTarget'
import { Color } from '../Color'
import { useTimeSignature } from '../../../hooks/RealTimeHooks'

type TimeSigNoteLengthWidgetProps = {
  targets: Array<MidiTarget>
  color?: Color
}

export const TimeSigNoteLengthWidget: React.FC<TimeSigNoteLengthWidgetProps> = ({
  targets,
  color = Color.PURPLE,
}) => {
  const timeSig = useTimeSignature()
  const pads = targets.map((target, i) => (
    <pad
      key={`time-sig-length-${i}`}
      target={target}
      color={i + 1 <= timeSig.noteLength ? color : Color.BLACK}
    />
  ))
  return <>{pads}</>
}
