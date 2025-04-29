import React from 'react'
import { Box, Button, Drawer } from '@mui/material'
import { AddWidgetComponent } from '../../../AddWidgetComponent'
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline'
import { useAtom } from 'jotai/index'
import { editWidgetsAtom } from '../../../../model/Widgets'

export type MidiStructorEditWidgetsProps = {}

export const MidiStructorEditWidgets: React.FC<
  MidiStructorEditWidgetsProps
> = ({}) => {
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
    </Box>
  )
}
