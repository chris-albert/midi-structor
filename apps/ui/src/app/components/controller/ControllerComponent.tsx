import React from 'react'
import { ConfiguredController, ConfiguredControllerType } from '@midi-structor/core'
import { Box, Button, Divider, Typography } from '@mui/material'
import IconButton from '@mui/material/IconButton'
import DeleteIcon from '@mui/icons-material/Delete'
import { SelectComponent, SelectItem } from '../SelectComponent'
import { VirtualControllerComponent } from './VirtualControllerComponent'
import { RealControllerComponent } from './RealControllerComponent'
import { PrimitiveAtom } from 'jotai'

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
  controllerAtom: PrimitiveAtom<ConfiguredController>
}

export const ControllerComponent: React.FC<ControllerComponentProps> = ({ controllerAtom }) => {
  const controller = ConfiguredController.useController(controllerAtom)

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
                  controller.setType(type)
                }
              }}
            />
          </Box>
          <IconButton
            aria-label='delete'
            onClick={() => {
              controller.remove()
            }}>
            <DeleteIcon color='error' />
          </IconButton>
        </Box>
      </Box>
      <Divider />
      {controller.type === 'virtual' ? (
        <VirtualControllerComponent />
      ) : (
        <RealControllerComponent controllerAtom={controllerAtom} />
      )}
    </Box>
  )
}
