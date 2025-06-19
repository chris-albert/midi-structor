import React from 'react'
import { PrimitiveAtom, useAtomValue } from 'jotai'
import { getHexColor, UITrack } from '@midi-structor/core'
import { Box, Grid } from '@mui/material'
import { splitAtom } from 'jotai/utils'
import { ClipComponent } from './ClipComponent'
import { useNavigate } from 'react-router-dom'
import { focusAtom } from 'jotai-optics'

export type TrackComponentProps = {
  track: UITrack
}

export const TrackComponent: React.FC<TrackComponentProps> = ({ track }) => {
  const navigate = useNavigate()

  const clips = track.clips

  return (
    <Grid
      sx={{
        borderTop: '1px solid white',
        borderBottom: '1px solid white',
        borderColor: 'divider',
      }}
      container
      spacing={0}>
      <Grid
        item
        xs={10}
        container>
        <Box
          sx={{
            display: 'flex',
            overflow: 'auto',
          }}>
          {clips.map((clip, index) => (
            <Box key={`track-${track.name}-clip-${index}`}>
              <ClipComponent clip={clip} />
            </Box>
          ))}
        </Box>
      </Grid>
      <Grid
        item
        xs={2}>
        <Box
          sx={{
            '&:hover': {
              border: '1px solid white',
              cursor: 'pointer',
            },
            height: 100,
            width: '100%',
            backgroundColor: getHexColor(track),
          }}
          onClick={() => {
            navigate(`/project/tracks/${track.name}/sections`)
          }}>
          <Box sx={{ p: 1 }}>{track.name}</Box>
        </Box>
      </Grid>
    </Grid>
  )
}
