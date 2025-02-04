import React from 'react'
import { StopWidget } from './StopWidget'
import { PlayWidget } from './PlayWidget'
import { MidiTarget } from '../../midi/MidiTarget'
import { ProjectHooks } from '../../project/ProjectHooks'

type PlayStopWidgetProps = {
  target: MidiTarget
}

export const PlayStopWidget: React.FC<PlayStopWidgetProps> = ({ target }) => {
  const isPlaying = ProjectHooks.useIsPlaying()

  return isPlaying ? <StopWidget target={target} /> : <PlayWidget target={target} />
}
