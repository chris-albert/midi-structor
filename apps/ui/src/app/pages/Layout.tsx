import React from 'react'
import { Box } from '@mui/material'
import { Nav } from '../Nav'
import { Outlet } from 'react-router-dom'
import { Midi } from '@midi-structor/core'

export type LayoutProps = {}

export const Layout: React.FC<LayoutProps> = ({}) => {
  const isAllowed = Midi.useMidiAllowed()

  return (
    <Box sx={{ height: '100%' }}>
      <Nav />
      {isAllowed ? <Outlet /> : null}
    </Box>
  )
}
