import React from 'react'
import { MidiSelectComponent } from './MidiSelectComponent'
import { Box } from '@mui/material'
import { AgentHooks } from '../../hooks/AgentHooks'

export type ControllerAgentModeComponentProps = {}

export const ControllerAgentModeComponent: React.FC<ControllerAgentModeComponentProps> = ({}) => {
  const { devices } = AgentHooks.useDevices()

  return (
    <Box>
      <Box>
        <MidiSelectComponent
          midiType='agent'
          midiDeviceType='input'
        />
        <MidiSelectComponent
          midiType='agent'
          midiDeviceType='output'
        />
      </Box>
    </Box>
  )
}
