import React from 'react'
import {
  ConfiguredController,
  ControllerDevices,
  State,
} from '@midi-structor/core'
import { Box, Divider, Typography } from '@mui/material'
import IconButton from '@mui/material/IconButton'
import SettingsIcon from '@mui/icons-material/Settings'
import { ControllerEditComponent } from './ControllerEditComponent'
import { ControllerHomeComponent } from './ControllerHomeComponent'
import { Option } from 'effect'

export type ControllerComponentProps = {
  controllerState: State<ConfiguredController>
}

export const ControllerComponent: React.FC<ControllerComponentProps> = ({
  controllerState,
}) => {
  const controller = ConfiguredController.useController(controllerState)

  const [isEdit, setIsEdit] = React.useState(false)

  return Option.match(ControllerDevices.findByName(controller.device), {
    onSome: (device) => (
      <Box sx={{ width: '100%', mt: -2 }}>
        <Box
          sx={{
            width: '100%',
            display: 'flex',
            justifyContent: 'space-between',
          }}>
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
            }}>
            <Typography variant='h5'>{controller.name}</Typography>
          </Box>
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'flex-end',
            }}>
            <Box
              sx={{
                display: 'flex',
              }}>
              <Box
                sx={{
                  display: 'flex',
                }}>
                <IconButton onClick={() => setIsEdit((e) => !e)}>
                  <SettingsIcon />
                </IconButton>
              </Box>
            </Box>
          </Box>
        </Box>
        <Divider />
        {isEdit ? (
          <ControllerEditComponent
            controllerState={controllerState}
            device={device}
          />
        ) : (
          <ControllerHomeComponent controllerState={controllerState} />
        )}
      </Box>
    ),
    onNone: () => <Box>Unknown Controller Device ${controller.device}</Box>,
  })
}
