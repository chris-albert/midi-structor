import React from 'react'
import { Box } from '@mui/material'
import { Nav } from '../Nav'
import { Outlet } from 'react-router-dom'
import { Midi } from '../midi/GlobalMidi'

export type LayoutProps = {}

export const Layout: React.FC<LayoutProps> = ({}) => {
  const isAllowed = Midi.useMidiAllowed()

  return (
    <Box>
      <Nav />
      {isAllowed ? <Outlet /> : null}
    </Box>
  )
}
