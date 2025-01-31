import React from 'react'
import { StopWidget } from './StopWidget'
import { PlayWidget } from './PlayWidget'
import { MidiTarget, ProjectHooks } from '@midi-structor/core'

type PlayStopWidgetProps = {
  target: MidiTarget
}

export const PlayStopWidget: React.FC<PlayStopWidgetProps> = ({ target }) => {
  const isPlaying = ProjectHooks.useIsPlaying()

  return isPlaying ? <StopWidget target={target} /> : <PlayWidget target={target} />
}
