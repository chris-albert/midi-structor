import React from 'react'
import { Box } from '@mui/material'
import { Nav } from '../Nav'
import { Outlet } from 'react-router-dom'
import { MidiDeviceManager } from '@midi-structor/core'
import { NoMidiAccessPage } from './NoMidiAccessPage'

export type LayoutProps = {}

export const Layout: React.FC<LayoutProps> = ({}) => {
  const isAllowed = MidiDeviceManager.useMidiAllowed()

  return (
    <Box sx={{ height: '100%' }}>
      <Nav />
      {isAllowed ? <Outlet /> : <NoMidiAccessPage />}
    </Box>
  )
}
