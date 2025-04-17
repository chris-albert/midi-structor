import React from 'react'
import { ConfiguredController, ControllerDevice } from '@midi-structor/core'
import { Box } from '@mui/material'
import _ from 'lodash'
import { WidgetComponent } from './WidgetComponent'

export type WidgetsComponentProps = {
  configuredController: ConfiguredController
  device: ControllerDevice
  isEdit: boolean
}

export const WidgetsComponent: React.FC<WidgetsComponentProps> = ({
  configuredController,
  device,
  isEdit,
}) => {
  return (
    <Box
      sx={{
        display: 'flex',
        flexWrap: 'wrap',
        gap: 1,
      }}>
      {_.map(device.widgets.resolve(configuredController.config), (widget, i) => (
        <Box
          key={`${widget.name}-${i}`}
          sx={
            {
              //   ...(widget.name === 'spacer' && widget.isLineBreaking
              //     ? {
              //       flexBasis: '100%',
              //       height: isEdit ? '80px' : '0',
              //     }
              //     : {}),
            }
          }>
          <WidgetComponent widget={widget} />
        </Box>
      ))}
    </Box>
  )
}
