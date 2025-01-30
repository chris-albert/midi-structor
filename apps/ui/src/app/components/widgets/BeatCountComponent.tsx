import React from 'react'
import { Box, Typography } from '@mui/material'
import { useBarBeats } from '../../hooks/RealTimeHooks'

export type BeatCountComponentProps = {}

export const BeatCountComponent: React.FC<BeatCountComponentProps> = ({}) => {
  const barBeat = useBarBeats()

  return (
    <Box
      sx={{
        height: 100,
        width: '100%',
      }}>
      <Typography
        variant='h1'
        align='center'>
        {barBeat}
      </Typography>
    </Box>
  )
}
