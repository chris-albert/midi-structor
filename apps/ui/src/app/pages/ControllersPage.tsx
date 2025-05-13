import React from 'react'
import { Box } from '@mui/material'
import { ControllersComponent } from '../components/controller/ControllersComponent'

export type ControllersPageProps = {}

export const ControllersPage: React.FC<ControllersPageProps> = ({}) => {
  return (
    <Box>
      <ControllersComponent />
    </Box>
  )
}
