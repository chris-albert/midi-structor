import React from 'react'
import { ConfiguredController, ConfiguredControllerType } from '@midi-structor/core'
import { Box, Button, Divider, Typography } from '@mui/material'
import IconButton from '@mui/material/IconButton'
import DeleteIcon from '@mui/icons-material/Delete'
import { SelectComponent, SelectItem } from '../SelectComponent'
import { VirtualControllerComponent } from './VirtualControllerComponent'
import { RealControllerComponent } from './RealControllerComponent'

const selectTypeItems: Array<SelectItem<ConfiguredControllerType>> = [
  {
    label: 'virtual',
    value: 'virtual',
  },
  {
    label: 'real',
    value: 'real',
  },
]

export type ControllerComponentProps = {
  controller: ConfiguredController
}

export const ControllerComponent: React.FC<ControllerComponentProps> = ({ controller }) => {
  const removeController = ConfiguredController.useRemoveController()
  const updateController = ConfiguredController.useUpdateController(controller)

  return (
    <Box sx={{ width: '100%' }}>
      <Box
        sx={{
          width: '100%',
          display: 'flex',
          justifyContent: 'space-between',
        }}>
        <Box>
          <Typography variant='h5'>{controller.name}</Typography>
        </Box>
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'flex-end',
          }}>
          <Box>
            <SelectComponent
              label='Type'
              containEmpty={false}
              activeLabel={controller.type}
              items={selectTypeItems}
              onChange={(type) => {
                if (type !== undefined) {
                  updateController({ ...controller, type })
                }
              }}
            />
          </Box>
          <IconButton
            aria-label='delete'
            onClick={() => {
              removeController(controller)
            }}>
            <DeleteIcon color='error' />
          </IconButton>
        </Box>
      </Box>
      <Divider />
      {controller.type === 'virtual' ? <VirtualControllerComponent /> : <RealControllerComponent />}
    </Box>
  )
}
