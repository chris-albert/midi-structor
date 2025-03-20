import React from 'react'
import { StopWidget } from './StopWidget'
import { PlayWidget } from './PlayWidget'
import { MidiTarget } from '../../midi/MidiTarget'
import { ProjectHooks } from '../../project/ProjectHooks'
import { Color } from '../Color'

type PlayStopWidgetProps = {
  target: MidiTarget
  playColor?: Color
  stopColor?: Color
}

export const PlayStopWidget: React.FC<PlayStopWidgetProps> = ({
  target,
  playColor = Color.GREEN,
  stopColor = Color.RED,
}) => {
  const isPlaying = ProjectHooks.useIsPlaying()

  return isPlaying ? (
    <StopWidget
      target={target}
      color={stopColor}
    />
  ) : (
    <PlayWidget
      target={target}
      color={playColor}
    />
  )
}
