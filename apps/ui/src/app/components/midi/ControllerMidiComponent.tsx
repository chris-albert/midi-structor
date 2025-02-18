import React from 'react'
import { Box, Card, CardContent, CardHeader, FormControlLabel, Switch } from '@mui/material'
import { ControllerBrowserModeComponent } from './ControllerBrowserModeComponent'
import { Midi } from '@midi-structor/core'

export type ControllerMidiComponentProps = {}

export const ControllerMidiComponent: React.FC<ControllerMidiComponentProps> = ({}) => {
  const enabled = Midi.useControllerEnabled()
  const onEnabled = (enabled: boolean) => {
    Midi.setControllerEnabled(enabled)
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
                    checked={enabled}
                    onChange={(d) => onEnabled(d.target.checked)}
                  />
                }
                label='Enabled'
              />
            </Box>
          }
        />
        <CardContent>
          <ControllerBrowserModeComponent />
        </CardContent>
      </Card>
    </Box>
  )
}
