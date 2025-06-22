import React from 'react'
import {
  ConfiguredController,
  ControllerDevice,
  State,
} from '@midi-structor/core'
import {
  Box,
  Button,
  Divider,
  FormControlLabel,
  Switch,
  Typography,
} from '@mui/material'
import { DeviceSelectorComponent } from './DeviceSelectorComponent'
import { ControllerBrowserModeComponent } from '../midi/ControllerBrowserModeComponent'
import DeleteIcon from '@mui/icons-material/Delete'
import { ControllerEditRawComponent } from './ControllerEditRawComponent'
import { ControllerNameComponent } from './ControllerNameComponent'
import { MuiColorInput } from 'mui-color-input'
import { stringToColor } from '../StringAvatarComponent'

export type ControllerEditComponentProps = {
  controllerState: State<ConfiguredController>
  device: ControllerDevice
}

export const ControllerEditComponent: React.FC<
  ControllerEditComponentProps
> = ({ controllerState, device }) => {
  const controller = ConfiguredController.useController(controllerState)

  return (
    <Box sx={{ pt: 1, display: 'flex', gap: 2 }}>
      <Box
        sx={{ width: '50%', display: 'flex', flexDirection: 'column', gap: 2 }}>
        <Typography variant='h6'>General</Typography>
        <Divider />
        <ControllerNameComponent controllerState={controllerState} />
        <DeviceSelectorComponent controllerState={controllerState} />
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
        <Box sx={{}}>
          <MuiColorInput
            label='Color'
            size='small'
            format='hex'
            value={controller.color || stringToColor(controller.name)}
            onChange={(n, c) => {
              controller.setColor(n)
            }}
          />
        </Box>
        <Typography variant='h6'>MIDI</Typography>
        <Divider />
        <ControllerBrowserModeComponent controllerState={controllerState} />
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
        <ControllerEditRawComponent
          controllerState={controllerState}
          device={device}
        />
      </Box>
    </Box>
  )
}
