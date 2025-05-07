import React from 'react'
import { Box } from '@mui/material'
import { WidgetButtonComponent } from './WidgetButtonComponent'

export type AddWidgetComponentProps = {}

export const AddWidgetComponent: React.FC<AddWidgetComponentProps> = ({}) => {
  return (
    <Box
      sx={{
        p: 2,
        display: 'flex',
        gap: 2,
      }}>
      <WidgetButtonComponent
        onClick={() => {
          // setWidgets(addWidget(beatCounter()))
        }}>
        Beat Counter
      </WidgetButtonComponent>
      ...
    </Box>
  )
}
