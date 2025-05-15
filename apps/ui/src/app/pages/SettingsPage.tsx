import React from 'react'
import { Box } from '@mui/material'
import { ProjectSettingsComponent } from '../components/settings/ProjectSettingsComponent'
import { GlobalSettingsComponent } from '../components/settings/GlobalSettingsComponent'

export type SettingsPageProps = {}

export const SettingsPage: React.FC<SettingsPageProps> = ({}) => {
  return (
    <Box
      sx={{
        display: 'flex',
        p: 2,
        gap: 2,
      }}>
      <ProjectSettingsComponent />
      <GlobalSettingsComponent />
    </Box>
  )
}
