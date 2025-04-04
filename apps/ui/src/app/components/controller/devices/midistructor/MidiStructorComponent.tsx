import React from 'react'
import { useAtom } from 'jotai/index'
import { editWidgetsAtom } from '../../../../model/Widgets'
import { Box, Button, Drawer } from '@mui/material'
import { AddWidgetComponent } from '../../../AddWidgetComponent'
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline'
import { WidgetsComponent } from '../../../WidgetsComponent'
import { ConfiguredController } from '@midi-structor/core'

export type MidiStructorComponentProps = {
  configuredController: ConfiguredController
}

export const MidiStructorComponent: React.FC<MidiStructorComponentProps> = ({ configuredController }) => {
  const [widgetOpen, setWidgetOpen] = React.useState(false)
  const [editWidgets, setEditWidgets] = useAtom(editWidgetsAtom)

  return (
    <Box>
      <Drawer
        anchor='top'
        open={widgetOpen}
        onClose={() => setWidgetOpen(false)}>
        <AddWidgetComponent />
      </Drawer>
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'right',
          p: 2,
        }}>
        <Button
          sx={{ mr: 2 }}
          variant='outlined'
          color={editWidgets ? 'error' : 'success'}
          startIcon={<AddCircleOutlineIcon />}
          onClick={() => setEditWidgets((e) => !e)}>
          {editWidgets ? 'Done Editing' : 'Edit Widgets'}
        </Button>
        <Button
          variant='outlined'
          startIcon={<AddCircleOutlineIcon />}
          onClick={() => setWidgetOpen(true)}>
          Add Widget
        </Button>
      </Box>
      <Box>
        <WidgetsComponent />
      </Box>
    </Box>
  )
}
