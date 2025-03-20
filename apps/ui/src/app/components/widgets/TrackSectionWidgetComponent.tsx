import React from 'react'
import _ from 'lodash'
import { Box } from '@mui/material'
import { SectionsTrackClipComponent } from '../SectionsTrackClipComponent'
import { TrackSectionsWidget } from '../../model/Widgets'
import { ProjectHooks } from '@midi-structor/core'

export type TrackSectionWidgetComponentProps = {
  widget: TrackSectionsWidget
}

export const TrackSectionWidgetComponent: React.FC<TrackSectionWidgetComponentProps> = ({ widget }) => {
  const trackName = widget.track

  const tracks = ProjectHooks.useTracks()

  const track = React.useMemo(() => {
    if (trackName !== undefined) {
      return _.find(tracks, (t) => t.name === trackName)
    } else {
      return undefined
    }
  }, [trackName])

  if (track === undefined) {
    return <Box>No track name defined</Box>
  } else {
    return (
      <SectionsTrackClipComponent
        track={track}
        size={widget.size}
        fontSize={widget.fontSize}
      />
    )
  }
}
