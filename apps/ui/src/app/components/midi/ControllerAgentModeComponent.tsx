import React from 'react'
import { MidiSelectComponent } from './MidiSelectComponent'
import { Box, FormControlLabel, Switch, Typography } from '@mui/material'
import { AgentHooks } from '../../hooks/AgentHooks'
import { MidiDeviceSelectionComponent } from './MidiDeviceSelectionComponent'

export type ControllerAgentModeComponentProps = {}

export const ControllerAgentModeComponent: React.FC<ControllerAgentModeComponentProps> = ({}) => {
  const inputControllerDevices = AgentHooks.useAgentDevices('input', 'controller')
  const outputControllerDevices = AgentHooks.useAgentDevices('output', 'controller')
  const inputDawDevices = AgentHooks.useAgentDevices('input', 'daw')
  const outputDawDevices = AgentHooks.useAgentDevices('output', 'daw')
  const [enabled, setEnabled] = AgentHooks.useAgentControllerEnabled()

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
              onChange={(d) => setEnabled(d.target.checked)}
            />
          }
          label='Enabled'
        />
      </Box>
      <Box sx={{ display: 'flex', gap: 1 }}>
        <Box sx={{ border: '1px solid gray' }}>
          <Typography sx={{ m: 1 }}>Agent</Typography>
          <MidiSelectComponent
            midiType='agent'
            midiDeviceType='input'
          />
          <MidiSelectComponent
            midiType='agent'
            midiDeviceType='output'
          />
        </Box>
        <Box sx={{ border: '1px solid gray' }}>
          <Typography sx={{ m: 1 }}>Controller</Typography>
          <MidiDeviceSelectionComponent midiDevices={inputControllerDevices} />
          <MidiDeviceSelectionComponent midiDevices={outputControllerDevices} />
        </Box>
        <Box sx={{ border: '1px solid gray' }}>
          <Typography sx={{ m: 1 }}>DAW</Typography>
          <MidiDeviceSelectionComponent midiDevices={inputDawDevices} />
          <MidiDeviceSelectionComponent midiDevices={outputDawDevices} />
        </Box>
      </Box>
    </Box>
  )
}
