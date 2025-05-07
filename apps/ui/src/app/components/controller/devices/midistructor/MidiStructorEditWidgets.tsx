import React from 'react'
import { Box, Button, Drawer } from '@mui/material'
import { AddWidgetComponent } from '../../../AddWidgetComponent'
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline'

export type MidiStructorEditWidgetsProps = {
  editWidgets: boolean
  toggleEditWidgets: () => void
}

export const MidiStructorEditWidgets: React.FC<
  MidiStructorEditWidgetsProps
> = ({ editWidgets, toggleEditWidgets }) => {
  const [addWidgetOpen, setAddWidgetOpen] = React.useState(false)

  return (
    <Box>
      <Drawer
        anchor='top'
        open={addWidgetOpen}
        onClose={() => setAddWidgetOpen(false)}>
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
          onClick={toggleEditWidgets}>
          {editWidgets ? 'Done Editing' : 'Edit Widgets'}
        </Button>
        <Button
          variant='outlined'
          startIcon={<AddCircleOutlineIcon />}
          onClick={() => setAddWidgetOpen(true)}>
          Add Widget
        </Button>
      </Box>
    </Box>
  )
}
