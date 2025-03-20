import React from 'react'
import { Color } from '../Color'
import { MidiTarget } from '../../midi/MidiTarget'
import { Midi } from '../../midi/GlobalMidi'
import { TX_MESSAGE } from '../../project/AbletonUIMessage'

type PlayWidgetProps = {
  target: MidiTarget
  color?: Color
}

export const PlayWidget: React.FC<PlayWidgetProps> = ({ target, color = Color.GREEN }) => {
  const dawEmitter = Midi.useDawEmitter()

  return (
    <pad
      color={color}
      target={target}
      onClick={() => dawEmitter.send(TX_MESSAGE.play())}
    />
  )
}
