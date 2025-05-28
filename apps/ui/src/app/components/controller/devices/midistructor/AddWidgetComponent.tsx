import React from 'react'
import { Box } from '@mui/material'
import {
  ConfiguredController,
  MIDIStructorUI,
  MIDIStructorUIWidgetsUpdate,
} from '@midi-structor/core'
import { WidgetButtonComponent } from './WidgetButtonComponent'

export type AddWidgetComponentProps = {
  updateWidgets: MIDIStructorUIWidgetsUpdate
  configuredController: ConfiguredController
}

export const AddWidgetComponent: React.FC<AddWidgetComponentProps> = ({
  updateWidgets,
  configuredController,
}) => {
  const resolved = MIDIStructorUI.device.widgets.resolve(
    configuredController.config
  )
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
            const input = MIDIStructorUI.getWidgetInput(widget, resolved, 8)
            const newWidget = widget.init(input)
            // @ts-ignore
            updateWidgets((w) => {
              return [...w, newWidget]
            })
          }}>
          {widget.name}
        </WidgetButtonComponent>
      ))}
    </Box>
  )
}
