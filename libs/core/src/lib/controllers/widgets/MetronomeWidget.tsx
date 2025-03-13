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

export const MetronomeWidgetOld: React.FC<MetronomeWidgetProps> = ({ target }) => {
  const beat = ProjectHooks.useBarBeats()

  const [color, setColor] = React.useState(Color.BLACK)

  React.useEffect(() => {
    setColor(beat === 1 ? Color.GREEN : Color.RED)
    const timer = setTimeout(() => {
      setColor(Color.BLACK)
    }, 100)
    return () => clearTimeout(timer)
  }, [beat])

  return (
    <pad
      color={color}
      target={target}
    />
  )
}
