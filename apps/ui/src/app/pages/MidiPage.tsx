import React from 'react'
import { Box, Divider, Typography } from '@mui/material'
import { MonitorPage } from './MonitorPage'

type MidiPageProps = {}

export const MidiPage: React.FC<MidiPageProps> = () => {
  return (
    <Box sx={{ p: 2 }}>
      <Typography variant='h4'>MIDI Monitor</Typography>
      <Divider sx={{ my: 2 }} />
      <MonitorPage />
    </Box>
  )
}
