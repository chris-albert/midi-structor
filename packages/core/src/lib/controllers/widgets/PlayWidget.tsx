import React from 'react'
import { Color } from '../Color'
import { Midi } from '../../midi/GlobalMidi'
import { TX_MESSAGE } from '../../project/AbletonUIMessage'
import { ControllerWidget } from '../ControllerWidget'
import { Schema } from 'effect'

export const PlayWidget = ControllerWidget.one({
  name: 'play',
  schema: Schema.Struct({
    color: Color.Schema,
  }),
  init: () => ({
    color: Color.GREEN,
  }),
  component: ({ target, color }) => {
    const dawEmitter = Midi.useDawEmitter()

    return (
      <pad
        color={color}
        target={target}
        onClick={() => dawEmitter.send(TX_MESSAGE.play())}
      />
    )
  },
})
