import React from 'react'
import { Box, Typography } from '@mui/material'
import { ProjectHooks } from '@midi-structor/core'

export type BeatCounterComponentProps = {}

export const BeatCounterComponent: React.FC<BeatCounterComponentProps> = ({}) => {
  const beat = ProjectHooks.useBeat()

  return (
    <Box
      sx={{
        height: 100,
        width: '100%',
      }}>
      <Typography
        variant='h1'
        align='center'>
        {beat}
      </Typography>
    </Box>
  )
}
