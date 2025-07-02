import React from 'react'
import {
  ConfiguredController,
  ConfiguredControllerHooks,
  State,
} from '@midi-structor/core'
import { Box, TextField } from '@mui/material'

export type ControllerNameComponentProps = {
  controllerState: State<ConfiguredController>
}

export const ControllerNameComponent: React.FC<
  ControllerNameComponentProps
> = ({ controllerState }) => {
  const controller = ConfiguredControllerHooks.useController(controllerState)

  return (
    <Box sx={{ width: '100%' }}>
      <TextField
        fullWidth
        label='Name'
        variant='outlined'
        size='small'
        value={controller.name}
        onChange={(e) => controller.setName(e.target.value)}
      />
    </Box>
  )
}
