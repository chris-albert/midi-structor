import React from 'react'
import { useIsPlaying } from '../../../hooks/RealTimeHooks'
import { StopWidget } from './StopWidget'
import { PlayWidget } from './PlayWidget'
import { MidiTarget } from '../../../midi/MidiTarget'

type PlayStopWidgetProps = {
  target: MidiTarget
}

export const PlayStopWidget: React.FC<PlayStopWidgetProps> = ({ target }) => {
  const isPlaying = useIsPlaying()

  return isPlaying ? <StopWidget target={target} /> : <PlayWidget target={target} />
}
