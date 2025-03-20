import React from 'react'
import { ActiveTrackClipWidget } from '../../model/Widgets'
import _ from 'lodash'
import { Box } from '@mui/material'
import { ActiveTrackClipComponent } from '../ActiveTrackClipComponent'
import { ProjectHooks } from '@midi-structor/core'

export type ActiveTrackClipWidgetComponentProps = {
  widget: ActiveTrackClipWidget
}

export const ActiveTrackClipWidgetComponent: React.FC<ActiveTrackClipWidgetComponentProps> = ({ widget }) => {
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
    return <ActiveTrackClipComponent track={track} />
  }
}
