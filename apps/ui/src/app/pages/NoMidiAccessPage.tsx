import React from 'react'
import { Box, Typography } from '@mui/material'

export type NoMidiAccessPageProps = {}

export const NoMidiAccessPage: React.FC<NoMidiAccessPageProps> = ({}) => {
  return (
    <Box sx={{ m: 2, display: 'flex', justifyContent: 'center' }}>
      <Typography variant='h4'>
        MIDI Structor needs MIDI enabled to work.
      </Typography>
    </Box>
  )
}
