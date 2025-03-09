import React from 'react'
import { Box, Card, CardContent, CardHeader, FormControlLabel, Switch } from '@mui/material'
import { ControllerBrowserModeComponent } from './ControllerBrowserModeComponent'
import { ConfiguredController, Midi } from '@midi-structor/core'
import { PrimitiveAtom } from 'jotai/index'

export type ControllerMidiComponentProps = {
  controllerAtom: PrimitiveAtom<ConfiguredController>
}

export const ControllerMidiComponent: React.FC<ControllerMidiComponentProps> = ({ controllerAtom }) => {
  const controller = ConfiguredController.useController(controllerAtom)
  const onEnabled = (enabled: boolean) => {
    controller.setEnabled(enabled)
  }

  return (
    <Box>
      <Card>
        <CardHeader
          title='Controller Setup'
          action={
            <Box sx={{ display: 'flex', ml: 2 }}>
              <FormControlLabel
                control={
                  <Switch
                    checked={controller.enabled}
                    onChange={(d) => onEnabled(d.target.checked)}
                  />
                }
                label='Enabled'
              />
            </Box>
          }
        />
        <CardContent>
          <ControllerBrowserModeComponent controllerAtom={controllerAtom} />
        </CardContent>
      </Card>
    </Box>
  )
}
