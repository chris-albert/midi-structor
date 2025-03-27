import React from 'react'
import { PrimitiveAtom } from 'jotai/index'
import { ConfiguredController } from '@midi-structor/core'
import { Box, Button, Divider, FormControlLabel, Switch, Typography } from '@mui/material'
import { DeviceSelectorComponent } from './DeviceSelectorComponent'
import { ControllerBrowserModeComponent } from '../midi/ControllerBrowserModeComponent'
import DeleteIcon from '@mui/icons-material/Delete'
import { ControllerEditRawComponent } from './ControllerEditRawComponent'
import { ControllerNameComponent } from './ControllerNameComponent'

export type ControllerEditComponentProps = {
  controllerAtom: PrimitiveAtom<ConfiguredController>
}

export const ControllerEditComponent: React.FC<ControllerEditComponentProps> = ({ controllerAtom }) => {
  const controller = ConfiguredController.useController(controllerAtom)

  return (
    <Box sx={{ pt: 1, display: 'flex', gap: 2 }}>
      <Box sx={{ width: '50%', display: 'flex', flexDirection: 'column', gap: 2 }}>
        <Typography variant='h6'>General</Typography>
        <Divider />
        <ControllerNameComponent controllerAtom={controllerAtom} />
        <DeviceSelectorComponent controllerAtom={controllerAtom} />
        <Box sx={{ ml: 1 }}>
          <FormControlLabel
            labelPlacement='end'
            control={
              <Switch
                checked={controller.enabled}
                onChange={(d) => controller.setEnabled(d.target.checked)}
              />
            }
            label='Enabled'
          />
        </Box>
        <Typography variant='h6'>MIDI</Typography>
        <Divider />
        <ControllerBrowserModeComponent controllerAtom={controllerAtom} />
        <Divider />
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'flex-end',
            p: 1,
          }}>
          <Button
            variant='contained'
            color='error'
            endIcon={<DeleteIcon />}
            onClick={controller.remove}>
            Delete Controller
          </Button>
        </Box>
      </Box>
      <Box sx={{ width: '50%' }}>
        <ControllerEditRawComponent controllerAtom={controllerAtom} />
      </Box>
    </Box>
  )
}
