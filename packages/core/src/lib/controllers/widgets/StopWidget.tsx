import React from 'react'
import { Color } from '../Color'
import { TX_MESSAGE } from '../../project/AbletonUIMessage'
import { ControllerWidget } from '../ControllerWidget'
import { Schema } from 'effect'
import { DawMidi } from '../../midi/DawMidi'

export const StopWidget = ControllerWidget.one({
  name: 'stop',
  schema: Schema.Struct({
    color: Color.Schema,
  }),
  init: () => ({
    color: Color.RED,
  }),
  component: ({ target, color }) => {
    const dawEmitter = DawMidi.useDawEmitter()

    return (
      <pad
        color={color}
        target={target}
        onClick={() => dawEmitter.send(TX_MESSAGE.stop())}
      />
    )
  },
})
