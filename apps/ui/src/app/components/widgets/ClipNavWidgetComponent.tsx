import React from 'react'
import { ClipNavWidget } from '../../model/Widgets'
import _ from 'lodash'
import { Box } from '@mui/material'
import { ClipNavComponent } from '../ClipNavComponent'
import { ProjectHooks } from '../../hooks/ProjectHooks'

export type ClipNavWidgetComponentProps = {
  widget: ClipNavWidget
}

export const ClipNavWidgetComponent: React.FC<ClipNavWidgetComponentProps> = ({ widget }) => {
  const trackName = widget.track

  const tracks = ProjectHooks.useTracks()
  const a = ProjectHooks.useArrangement()

  const track = React.useMemo(() => {
    if (trackName !== undefined) {
      return _.find(tracks, (t) => t.name === trackName)
    }
  }, [trackName])

  if (track === undefined) {
    return <Box>No track name defined</Box>
  } else {
    return <ClipNavComponent track={track} />
  }
}
