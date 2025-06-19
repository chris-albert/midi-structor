import React from 'react'
import { Box } from '@mui/material'
import { TrackComponent } from '../TrackComponent'
import { ArrangementTimelineComponent } from './ArrangementTimelineComponent'
import { ProjectHooks } from '@midi-structor/core'

export type ArrangementComponentProps = {}

export const ArrangementComponent: React.FC<
  ArrangementComponentProps
> = ({}) => {
  const tracks = ProjectHooks.useTracks()

  return (
    <Box>
      <ArrangementTimelineComponent />
      {tracks.map((track, i) => (
        <Box key={`tracks-${i}`}>
          <TrackComponent track={track} />
        </Box>
      ))}
    </Box>
  )
}
