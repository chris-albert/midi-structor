import React from 'react'
import { ConfiguredController } from '@midi-structor/core'
import { Box, Divider, Typography } from '@mui/material'
import IconButton from '@mui/material/IconButton'
import { PrimitiveAtom } from 'jotai'
import SettingsIcon from '@mui/icons-material/Settings'
import { ControllerEditComponent } from './ControllerEditComponent'
import { ControllerHomeComponent } from './ControllerHomeComponent'

export type ControllerComponentProps = {
  controllerAtom: PrimitiveAtom<ConfiguredController>
}

export const ControllerComponent: React.FC<ControllerComponentProps> = ({ controllerAtom }) => {
  const controller = ConfiguredController.useController(controllerAtom)

  const [isEdit, setIsEdit] = React.useState(false)

  return (
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
        <ControllerEditComponent controllerAtom={controllerAtom} />
      ) : (
        <ControllerHomeComponent controllerAtom={controllerAtom} />
      )}
    </Box>
  )
}
