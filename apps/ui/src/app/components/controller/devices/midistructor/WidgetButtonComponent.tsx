import React from 'react'
import { Button } from '@mui/material'
import { ProjectHooks } from '@midi-structor/core'

export type WidgetButtonComponentProps = {
  children: React.ReactElement | string
  onClick: () => void
}

export const WidgetButtonComponent: React.FC<WidgetButtonComponentProps> = ({
  children,
  onClick,
}) => {
  return (
    <Button
      variant='outlined'
      size='large'
      sx={{
        width: 100,
        height: 100,
      }}
      onClick={onClick}>
      {children}
    </Button>
  )
}
