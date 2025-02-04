import React from 'react'
import { Color } from '../Color'
import { MidiTarget } from '../../midi/MidiTarget'
import { ProjectHooks } from '../../project/ProjectHooks'

type MetronomeWidgetProps = {
  target: MidiTarget
}

export const MetronomeWidget: React.FC<MetronomeWidgetProps> = ({ target }) => {
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
