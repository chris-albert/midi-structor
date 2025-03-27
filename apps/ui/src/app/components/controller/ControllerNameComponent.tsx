import React from 'react'
import { PrimitiveAtom } from 'jotai/index'
import { ConfiguredController } from '@midi-structor/core'
import { Box, TextField } from '@mui/material'

export type ControllerNameComponentProps = {
  controllerAtom: PrimitiveAtom<ConfiguredController>
}

export const ControllerNameComponent: React.FC<ControllerNameComponentProps> = ({ controllerAtom }) => {
  const controller = ConfiguredController.useController(controllerAtom)

  return (
    <Box sx={{ m: 1, width: '100%' }}>
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
