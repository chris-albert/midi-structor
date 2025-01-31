import React from 'react'
import { Box, Typography } from '@mui/material'
import { ProjectHooks } from '@midi-structor/core'

export type TimeSignatureComponentProps = {}

export const TimeSignatureComponent: React.FC<TimeSignatureComponentProps> = ({}) => {
  const timeSignature = ProjectHooks.useTimeSignature()

  return (
    <Box
      sx={{
        height: 100,
        width: '100%',
      }}>
      <Typography
        variant='h1'
        align='center'>
        {timeSignature.noteCount}/{timeSignature.noteLength}
      </Typography>
    </Box>
  )
}
