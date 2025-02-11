import React from 'react'
import { Box, FormControlLabel, Switch } from '@mui/material'
import { MidiSelectComponent } from './MidiSelectComponent'
import { Midi } from '@midi-structor/core'

export type ControllerBrowserModeComponentProps = {}

export const ControllerBrowserModeComponent: React.FC<ControllerBrowserModeComponentProps> = ({}) => {
  const enabled = Midi.useControllerEnabled()
  const onEnabled = (enabled: boolean) => {
    Midi.setControllerEnabled(enabled)
  }

  return (
    <Box>
      <Box
        sx={{
          ml: 2,
          mb: 2,
        }}>
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
      <MidiSelectComponent
        midiType='controller'
        midiDeviceType='input'
      />
      <MidiSelectComponent
        midiType='controller'
        midiDeviceType='output'
      />
    </Box>
  )
}
