import React from 'react'
import { Box, Card, CardContent, CardHeader } from '@mui/material'
import { ControllerBrowserModeComponent } from './ControllerBrowserModeComponent'
import { RealConfiguredController } from '@midi-structor/core'
import { PrimitiveAtom } from 'jotai/index'

export type ControllerMidiComponentProps = {
  controllerAtom: PrimitiveAtom<RealConfiguredController>
}

export const ControllerMidiComponent: React.FC<ControllerMidiComponentProps> = ({ controllerAtom }) => {
  return (
    <Box>
      <Card>
        <CardHeader title='Controller Setup' />
        <CardContent>
          <ControllerBrowserModeComponent controllerAtom={controllerAtom} />
        </CardContent>
      </Card>
    </Box>
  )
}
