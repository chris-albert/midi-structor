import React from 'react'
import { Box } from '@mui/material'

export type PadUIComponentProps = {
  children: React.ReactNode
}

export const PadUIComponent: React.FC<PadUIComponentProps> = ({ children }) => {
  return (
    <Box
      sx={{
        height: 100,
        width: '100%',
        display: 'flex',
      }}>
      {children}
    </Box>
  )
}
