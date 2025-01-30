import React from 'react'
import { Box } from '@mui/material'
import { LaunchpadMiniComponent } from '../components/controllers/LaunchpadMiniComponent'

export type ControllersPageProps = {}

export const ControllersPage: React.FC<ControllersPageProps> = ({}) => {
  return (
    <Box>
      <LaunchpadMiniComponent />
    </Box>
  )
}
