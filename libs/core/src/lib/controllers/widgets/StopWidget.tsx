import React from 'react'
import { Color } from '../Color'
import { MidiTarget } from '../../midi/MidiTarget'
import { Midi } from '../../midi/GlobalMidi'
import { TX_MESSAGE } from '../../project/AbletonUIMessage'

type StopWidgetProps = {
  target: MidiTarget
}

export const StopWidget: React.FC<StopWidgetProps> = ({ target }) => {
  const dawEmitter = Midi.useDawEmitter()

  return (
    <pad
      color={Color.RED}
      target={target}
      onClick={() => dawEmitter.send(TX_MESSAGE.stop())}
    />
  )
}
