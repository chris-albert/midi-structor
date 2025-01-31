import React from 'react'
import { Color } from '../Color'
import { Midi, MidiTarget, TX_MESSAGE } from '@midi-structor/core'

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
