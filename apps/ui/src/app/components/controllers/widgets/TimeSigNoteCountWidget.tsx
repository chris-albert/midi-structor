import React from 'react'
import { Color } from '../Color'
import { MidiTarget } from '../../../midi/MidiTarget'
import { useTimeSignature } from '../../../hooks/RealTimeHooks'

type TimeSigNoteCountWidgetProps = {
  targets: Array<MidiTarget>
  color?: Color
}

export const TimeSigNoteCountWidget: React.FC<TimeSigNoteCountWidgetProps> = ({
  targets,
  color = Color.BLUE,
}) => {
  const timeSig = useTimeSignature()
  const pads = targets.map((target, i) => (
    <pad
      key={`time-sig-count-${i}`}
      target={target}
      color={i + 1 <= timeSig.noteCount ? color : Color.BLACK}
    />
  ))
  return <>{pads}</>
}
