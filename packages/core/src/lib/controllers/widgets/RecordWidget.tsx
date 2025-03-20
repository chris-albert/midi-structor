import React from 'react'
import { MidiTarget } from '../../midi/MidiTarget'
import { Color } from '../Color'
import { Midi } from '../../midi/GlobalMidi'
import { TX_MESSAGE } from '../../project/AbletonUIMessage'

export type RecordWidgetProps = {
  target: MidiTarget
  color?: Color
}

export const RecordWidget: React.FC<RecordWidgetProps> = ({ target, color = Color.PURPLE }) => {
  const dawEmitter = Midi.useDawEmitter()

  return (
    <pad
      color={color}
      target={target}
      onClick={() => dawEmitter.send(TX_MESSAGE.record())}
    />
  )
}
