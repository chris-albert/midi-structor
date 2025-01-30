import React from 'react'
import { Box } from '@mui/material'
import { TrackComponent } from '../TrackComponent'
import { ArrangementTimelineComponent } from './ArrangementTimelineComponent'
import { ProjectHooks } from '../../hooks/ProjectHooks'

export type ArrangementComponentProps = {}

export const ArrangementComponent: React.FC<ArrangementComponentProps> = ({}) => {
  const tracks = ProjectHooks.useTracksAtoms()

  return (
    <Box>
      <ArrangementTimelineComponent />
      {tracks.map((trackAtom, i) => (
        <Box key={`tracks-${i}`}>
          <TrackComponent trackAtom={trackAtom} />
        </Box>
      ))}
    </Box>
  )
}
