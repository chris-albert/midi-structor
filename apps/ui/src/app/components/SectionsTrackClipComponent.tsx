import React from 'react'
import { getHexColor, UIClip, UITrack } from '../model/UIStateDisplay'
import { Box, Typography } from '@mui/material'
import _ from 'lodash'
import { ProjectHooks } from '../hooks/ProjectHooks'
const INACTIVE_COLOR = '#777777'

export type SectionsTrackClipComponentProps = {
  track: UITrack
  size: number
  fontSize: string
}

export const SectionsTrackClipComponent: React.FC<SectionsTrackClipComponentProps> = ({
  track,
  size,
  fontSize,
}) => {
  const activeClip = ProjectHooks.useActiveClip(track)
  const beat = ProjectHooks.useBeat()

  const visibleClips = React.useMemo(() => {
    if (activeClip === undefined) {
      return _.take(track.clips, size)
    } else {
      const tmpClips: Array<UIClip> = []
      track.clips.forEach((clip) => {
        if (clip.startTime >= activeClip.startTime) {
          tmpClips.push(clip)
        }
      })
      return _.take(tmpClips, size)
    }
  }, [activeClip, track, size])

  const progress: number | undefined = React.useMemo(() => {
    if (activeClip && activeClip.endTime !== undefined) {
      const total = activeClip.endTime - activeClip.startTime
      const fromStart = beat - activeClip.startTime
      return (fromStart / total) * 100
    } else {
      return undefined
    }
  }, [activeClip, beat])

  return (
    <Box
      sx={{
        height: 100,
        display: 'flex',
      }}>
      {visibleClips.map((clip, clipIndex) => (
        <Box
          key={`section-track-${track.name}-clip-${clipIndex}`}
          sx={{
            display: 'flex',
            border: clip === activeClip ? '2px solid white' : `2px solid ${INACTIVE_COLOR}`,
            width: 100,
            backgroundColor: clip.type === 'real' ? getHexColor(clip) : INACTIVE_COLOR,
            alignItems: 'center',
            justifyContent: 'center',
          }}>
          <Box
            sx={{
              position: 'relative',
              height: '100%',
              width: '100%',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            {clip === activeClip && progress !== undefined ? (
              <Box
                sx={{
                  position: 'absolute',
                  top: 0,
                  left: progress,
                  height: '100%',
                  width: '5px',
                  backgroundColor: 'black',
                }}
              />
            ) : null}
            <Typography sx={{ fontSize }}>{clip.type === 'real' ? clip.name : ''}</Typography>
          </Box>
        </Box>
      ))}
    </Box>
  )
}
