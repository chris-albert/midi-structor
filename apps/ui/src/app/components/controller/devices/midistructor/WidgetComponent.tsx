import React from 'react'
import {
  AllMidiStructorWidgets,
  MIDIStructorStore,
  MIDIStructorUIWidget,
  MIDIStructorUIWidgetsUpdate,
  OnClick,
  ProjectHooks,
} from '@midi-structor/core'
import { Box, Drawer, Paper } from '@mui/material'
import { WidgetSettingsComponent } from '../../../widgets/WidgetSettingsComponent'
import IconButton from '@mui/material/IconButton'
import MenuIcon from '@mui/icons-material/Menu'

const getLabel = (widget: MIDIStructorUIWidget): React.ReactElement | null =>
  widget.label === undefined ? null : (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}>
      <Box
        sx={{
          position: 'absolute',
          x: 0,
          y: '0',
          marginTop: '-16px',
          backgroundColor: '#777777',
          border: '1px solid white',
          lineHeight: 1,
          borderBottomLeftRadius: '5px',
          borderBottomRightRadius: '5px',
          paddingLeft: '3px',
          paddingRight: '3px',
        }}>
        {widget.label}
      </Box>
    </Box>
  )

export type WidgetComponentProps = {
  widget: MIDIStructorUIWidget
  onClick: OnClick
  store: MIDIStructorStore
  isEdit: boolean
  updateWidgets: MIDIStructorUIWidgetsUpdate
}

export const WidgetComponent: React.FC<WidgetComponentProps> = ({
  widget,
  onClick,
  store,
  isEdit,
  updateWidgets,
}) => {
  const [settingsOpen, setSettingsOpen] = React.useState(false)
  const projectStyle = ProjectHooks.useProjectStyle()

  const el = AllMidiStructorWidgets.all.Component(widget, onClick, store)
  const label = getLabel(widget)

  const widgetBody = (
    <Box
      sx={{
        p: 2,
        borderWidth: `${
          widget.border?.sizePx !== undefined ? widget.border?.sizePx : 1
        }px`,
        borderColor: `#${widget.border?.color || 'ffffff'}`,
        borderStyle: 'solid',
        borderRadius: '5px',
      }}>
      {label}
      <Box>{el}</Box>
    </Box>
  )
  if (isEdit) {
    return (
      <Box>
        <Drawer
          open={settingsOpen}
          onClose={() => setSettingsOpen(false)}
          anchor='right'
          sx={{
            flexShrink: 0,
          }}>
          <WidgetSettingsComponent
            widget={widget}
            updateWidgets={updateWidgets}
            onClose={() => setSettingsOpen((s) => !s)}
          />
        </Drawer>
        <Paper>
          <Box
            sx={{
              border: '1px solid #777777',
              borderRadius: '5px',
              // background: projectStyle.horizontalGradient,
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
      </Box>
    )
  } else if (widget.visible === undefined || widget.visible) {
    return <Box>{widgetBody}</Box>
  } else {
    return el
  }
}
