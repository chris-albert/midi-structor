import React from 'react'
import { Color } from '../Color'
import { MidiTarget } from '../../midi/MidiTarget'
import { Midi } from '../../midi/GlobalMidi'
import { TX_MESSAGE } from '../../project/AbletonUIMessage'

type PlayWidgetProps = {
  target: MidiTarget
}

export const PlayWidget: React.FC<PlayWidgetProps> = ({ target }) => {
  const dawEmitter = Midi.useDawEmitter()

  return (
    <pad
      color={Color.GREEN}
      target={target}
      onClick={() => dawEmitter.send(TX_MESSAGE.play())}
    />
  )
}
