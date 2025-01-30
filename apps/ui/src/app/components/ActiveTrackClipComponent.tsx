import React from 'react'
import { Box, Typography } from '@mui/material'
import { getHexColor, UITrack } from '../model/UIStateDisplay'
import { ProjectHooks } from '../hooks/ProjectHooks'
const INACTIVE_COLOR = '#777777'
const INACTIVE_CLIP_NAME = 'None'

export type ActiveTrackClipComponentProps = {
  track: UITrack
}

export const ActiveTrackClipComponent: React.FC<ActiveTrackClipComponentProps> = ({ track }) => {
  const clip = ProjectHooks.useActiveClip(track)

  const activeColor = React.useMemo(() => {
    if (clip !== undefined && clip.type === 'real') {
      return getHexColor(clip)
    } else {
      return INACTIVE_COLOR
    }
  }, [clip])

  const activeClipName = React.useMemo(() => {
    if (clip !== undefined && clip.type === 'real') {
      return clip.name
    } else {
      return INACTIVE_CLIP_NAME
    }
  }, [clip])

  return (
    <Box
      sx={{
        display: 'flex',
        border: '1px solid transparent',
        '&:hover': {
          border: '1px solid white',
          cursor: 'pointer',
        },
        overflow: 'auto',
        height: 100,
        width: '100%',
        backgroundColor: `${activeColor}`,
        alignItems: 'center',
        justifyContent: 'center',
      }}>
      <Typography
        variant='h1'
        align='center'>
        {activeClipName}
      </Typography>
    </Box>
  )
}
