import React from 'react'
import { Color } from '../Color'
import { TX_MESSAGE } from '../../project/AbletonUIMessage'
import { ControllerWidget } from '../ControllerWidget'
import { Schema } from 'effect'
import { DawMidi } from '../../midi/DawMidi'

export const RecordWidget = ControllerWidget.one({
  name: 'record',
  schema: Schema.Struct({
    color: Color.Schema,
  }),
  init: () => ({
    color: Color.PURPLE,
  }),
  component: ({ target, color }) => {
    const dawEmitter = DawMidi.useDawEmitter()

    return (
      <pad
        color={color}
        target={target}
        onClick={() => dawEmitter.send(TX_MESSAGE.record())}
      />
    )
  },
})
