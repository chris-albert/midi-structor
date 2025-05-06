import React from 'react'
import { Widget } from '../model/Widgets'
import { Box, Drawer, Paper } from '@mui/material'

import IconButton from '@mui/material/IconButton'
import MenuIcon from '@mui/icons-material/Menu'
import { WidgetSettingsComponent } from './widgets/WidgetSettingsComponent'
import { UIWidgets } from '../hooks/UIWidgets'

export type WidgetComponentProps = {
  widget: Widget
}

export const WidgetComponent: React.FC<WidgetComponentProps> = ({ widget }) => {
  const [_, setWidgets] = UIWidgets.useWidgets()
  const [settingsOpen, setSettingsOpen] = React.useState(false)

  const el = <Box>Unknown</Box>
  const widgetBody = <Box>Body</Box>

  if (true) {
    return (
      <Paper>
        <Drawer
          open={settingsOpen}
          onClose={() => setSettingsOpen(false)}
          anchor='right'
          // variant='persistent'
          sx={{
            flexShrink: 0,
          }}>
          <WidgetSettingsComponent
            widget={widget}
            setWidgets={setWidgets}
          />
        </Drawer>
        {/*<Modal*/}
        {/*  open={settingsOpen}*/}
        {/*  onClose={() => setSettingsOpen(false)}*/}
        {/*>*/}
        {/*  <Box sx={modalStyle}>*/}
        {/*    <WidgetSettingsComponent*/}
        {/*      widget={widget}*/}
        {/*      setWidgets={setWidgets}*/}
        {/*    />*/}
        {/*  </Box>*/}
        {/*</Modal>*/}
        <Box
          sx={{
            border: '1px solid #777777',
            borderRadius: '5px',
            display: 'flex',
            justifyContent: 'space-between',
          }}>
          <Box></Box>
          <Box>
            <IconButton
              onClick={() => {
                setSettingsOpen(true)
              }}
              aria-label='Edit'>
              <MenuIcon />
            </IconButton>
          </Box>
        </Box>
        {widgetBody}
      </Paper>
    )
  } else {
    return widgetBody
  }
}
