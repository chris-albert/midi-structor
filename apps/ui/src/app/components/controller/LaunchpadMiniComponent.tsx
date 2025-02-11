import React from 'react'
import { Box, Button } from '@mui/material'
import { ControllerGridComponent } from './ControllerGridComponent'
import { LaunchPadMiniMk3UI } from './LaunchPadMiniMk3UI'
import { Midi, LaunchPadMiniMk3 } from '@midi-structor/core'

export type LaunchpadMiniComponentProps = {}

export const LaunchpadMiniComponent: React.FC<LaunchpadMiniComponentProps> = ({}) => {
  const emitter = Midi.useControllerEmitter()
  const listener = Midi.useControllerListener()
  const controller = LaunchPadMiniMk3(emitter, listener)
  const controllerUI = LaunchPadMiniMk3UI(controller)

  const enableProgrammerMode = () => {
    controller.init()
  }

  const clearPads = () => {
    controller.clear()
  }

  const reBind = () => {}

  return (
    <Box
      sx={{
        display: 'flex',
        gap: '1rem',
        flexDirection: 'column',
        p: 2,
      }}>
      <Box>
        <Button
          onClick={enableProgrammerMode}
          variant='outlined'>
          Enable Programmer Mode
        </Button>
        <Button
          sx={{ ml: 2 }}
          onClick={clearPads}
          variant='outlined'>
          Clear Pads
        </Button>
        <Button
          sx={{ ml: 2 }}
          onClick={reBind}
          variant='outlined'>
          Re-Bind
        </Button>
      </Box>
      <Box>
        <ControllerGridComponent controller={controllerUI} />
      </Box>
    </Box>
  )
}
