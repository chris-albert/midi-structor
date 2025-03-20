import React from 'react'
import { Color } from '../Color'
import { MidiTarget } from '../../midi/MidiTarget'
import { Midi } from '../../midi/GlobalMidi'
import { TX_MESSAGE } from '../../project/AbletonUIMessage'

type StopWidgetProps = {
  target: MidiTarget
  color?: Color
}

export const StopWidget: React.FC<StopWidgetProps> = ({ target, color = Color.RED }) => {
  const dawEmitter = Midi.useDawEmitter()

  return (
    <pad
      color={color}
      target={target}
      onClick={() => dawEmitter.send(TX_MESSAGE.stop())}
    />
  )
}
