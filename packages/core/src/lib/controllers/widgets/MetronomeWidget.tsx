import React from 'react'
import { Color } from '../Color'
import { ForeverBeat } from '../../hooks/ForeverBeat'
import { ControllerWidget } from '../ControllerWidget'
import { Schema } from 'effect'

export const MetronomeWidget = ControllerWidget.one({
  name: 'metronome',
  schema: Schema.Struct({
    oneColor: Color.Schema,
    restColor: Color.Schema,
  }),
  init: () => ({
    oneColor: Color.GREEN,
    restColor: Color.RED,
  }),
  component: ({ target, oneColor, restColor }) => {
    const [color, setColor] = React.useState(Color.BLACK)

    React.useEffect(
      () =>
        ForeverBeat.onTick((p) => {
          if (!p.halfBeat && p.isPlaying) {
            setColor(p.beat === 1 ? oneColor : restColor)
          } else {
            setColor(Color.BLACK)
          }
        }),
      []
    )

    return (
      <pad
        color={color}
        target={target}
      />
    )
  },
})
