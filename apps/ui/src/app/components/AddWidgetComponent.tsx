import React from 'react'
import { Box } from '@mui/material'
import { WidgetButtonComponent } from './WidgetButtonComponent'
import { UIWidgets } from '../hooks/UIWidgets'

export type AddWidgetComponentProps = {}

export const AddWidgetComponent: React.FC<AddWidgetComponentProps> = ({}) => {
  const [_, setWidgets] = UIWidgets.useWidgets()

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
