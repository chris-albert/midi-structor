import React from 'react'
import { Box } from '@mui/material'
import { ControllerGridComponent } from './ControllerGridComponent'
import { LaunchPadMiniMk3UI } from './LaunchPadMiniMk3UI'
import { Midi, LaunchPadMiniMk3 } from '@midi-structor/core'

export type LaunchpadMiniComponentProps = {}

export const LaunchpadMiniComponent: React.FC<LaunchpadMiniComponentProps> = ({}) => {
  const emitter = Midi.useControllerEmitter()
  const listener = Midi.useControllerListener()
  const controller = LaunchPadMiniMk3(emitter, listener)
  const controllerUI = LaunchPadMiniMk3UI(controller)

  return (
    <Box
      sx={{
        display: 'flex',
        gap: '1rem',
        flexDirection: 'column',
        p: 2,
      }}>
      <Box>
        <ControllerGridComponent controller={controllerUI} />
      </Box>
    </Box>
  )
}
