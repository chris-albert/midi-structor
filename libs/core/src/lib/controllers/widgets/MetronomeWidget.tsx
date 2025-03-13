import React from 'react'
import { Color } from '../Color'
import { MidiTarget } from '../../midi/MidiTarget'
import { ProjectHooks } from '../../project/ProjectHooks'
import { ForeverBeat } from '../../hooks/ForeverBeat'

type MetronomeWidgetProps = {
  target: MidiTarget
}

export const MetronomeWidget: React.FC<MetronomeWidgetProps> = ({ target }) => {
  const [color, setColor] = React.useState(Color.BLACK)

  React.useEffect(
    () =>
      ForeverBeat.onTick((p) => {
        if (!p.halfBeat && p.isPlaying) {
          setColor(p.beat === 1 ? Color.GREEN : Color.RED)
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
}
