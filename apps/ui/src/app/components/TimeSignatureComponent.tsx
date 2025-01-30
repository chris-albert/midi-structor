import React from 'react'
import { Box, Typography } from '@mui/material'
import { useTimeSignature } from '../hooks/RealTimeHooks'

export type TimeSignatureComponentProps = {}

export const TimeSignatureComponent: React.FC<TimeSignatureComponentProps> = ({}) => {
  const timeSignature = useTimeSignature()

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
