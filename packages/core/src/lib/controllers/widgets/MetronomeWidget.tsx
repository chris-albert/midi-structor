import React from 'react'
import { Color } from '../Color'
import { MidiTarget } from '../../midi/MidiTarget'
import { ForeverBeat } from '../../hooks/ForeverBeat'
import { ControllerWidget } from '../ControllerWidget'
import { Schema } from 'effect'

export const MetronomeWidget = ControllerWidget.of({
  name: 'metronome',
  schema: Schema.Struct({
    target: MidiTarget.Schema,
    oneColor: Color.Schema,
    restColor: Color.Schema,
  }),
  targets: (w) => [w.target],
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
