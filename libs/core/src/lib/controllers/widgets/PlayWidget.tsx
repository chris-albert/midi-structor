import React from 'react'
import { Color } from '../Color'
import { Midi, MidiTarget, TX_MESSAGE } from '@midi-structor/core'

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
