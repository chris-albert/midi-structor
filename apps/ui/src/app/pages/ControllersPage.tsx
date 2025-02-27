import React from 'react'
import { Box } from '@mui/material'
import { LaunchpadMiniComponent } from '../components/controller/LaunchpadMiniComponent'
import { ControllersComponent } from '../components/controller/ControllersComponent'

export type ControllersPageProps = {}

export const ControllersPage: React.FC<ControllersPageProps> = ({}) => {
  return (
    <Box sx={{ height: '100%' }}>
      <ControllersComponent />
      {/*<LaunchpadMiniComponent />*/}
    </Box>
  )
}
