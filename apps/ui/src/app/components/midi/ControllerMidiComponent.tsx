import React from 'react'
import { Box, Card, CardContent, CardHeader } from '@mui/material'
import { ControllerBrowserModeComponent } from './ControllerBrowserModeComponent'
import { ConfiguredController, State } from '@midi-structor/core'

export type ControllerMidiComponentProps = {
  controllerState: State<ConfiguredController>
}

export const ControllerMidiComponent: React.FC<
  ControllerMidiComponentProps
> = ({ controllerState }) => {
  return (
    <Box>
      <Card>
        <CardHeader title='Controller Setup' />
        <CardContent>
          <ControllerBrowserModeComponent controllerState={controllerState} />
        </CardContent>
      </Card>
    </Box>
  )
}
