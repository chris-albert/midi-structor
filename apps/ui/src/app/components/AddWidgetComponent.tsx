import React from 'react'
import { Box } from '@mui/material'
import { WidgetButtonComponent } from './WidgetButtonComponent'
import {
  MIDIStructorUI,
  MIDIStructorUIWidgetsUpdate,
} from '@midi-structor/core'

export type AddWidgetComponentProps = {
  updateWidgets: MIDIStructorUIWidgetsUpdate
}

export const AddWidgetComponent: React.FC<AddWidgetComponentProps> = ({
  updateWidgets,
}) => {
  return (
    <Box
      sx={{
        p: 2,
        display: 'flex',
        gap: 2,
      }}>
      {MIDIStructorUI.device.widgets.widgets.map((widget) => (
        <WidgetButtonComponent
          key={`widet-${widget.name}`}
          onClick={() => {
            updateWidgets((w) => {
              // console.log(w, widget)
              return [...w]
            })
          }}>
          {widget.name}
        </WidgetButtonComponent>
      ))}
    </Box>
  )
}
