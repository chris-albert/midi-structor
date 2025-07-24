import React from 'react'
import {
  AllMidiStructorWidgets,
  MIDIStructorStore,
  MIDIStructorUIWidget,
  MIDIStructorUIWidgetsUpdate,
  OnClick,
  ProjectHooks,
} from '@midi-structor/core'
import {
  Box,
  Drawer,
  Fab,
  Paper,
  SpeedDial,
  SpeedDialAction,
  styled,
} from '@mui/material'
import { WidgetSettingsComponent } from '../../../widgets/WidgetSettingsComponent'
import IconButton from '@mui/material/IconButton'
import MenuIcon from '@mui/icons-material/Menu'
import ArrowLeftIcon from '@mui/icons-material/ArrowLeftOutlined'
import ArrowRightIcon from '@mui/icons-material/ArrowRightOutlined'
import DeleteIcon from '@mui/icons-material/Delete'
import ContentCopyIcon from '@mui/icons-material/ContentCopy'
import SettingsIcon from '@mui/icons-material/Settings'
import {
  duplicateWidget,
  moveLeftWidget,
  moveRightWidget,
  removeWidget,
} from '../../../../model/Widgets'

const isSpeedDial = true

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
  widgetIndex: number
}

export const WidgetComponent: React.FC<WidgetComponentProps> = ({
  widget,
  onClick,
  store,
  isEdit,
  updateWidgets,
  widgetIndex,
}) => {
  const [settingsOpen, setSettingsOpen] = React.useState(false)
  const projectStyle = ProjectHooks.useProjectStyle()

  const squareFab = {
    m: 0,
    mt: '1px',
    width: 32,
    height: 32,
    minHeight: 'unset',
    borderRadius: '4px',
    clipPath: 'polygon(0 0, 100% 0, 100% 100%, 0 100%)',
    background: projectStyle.offsetGradient,
  }

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
    if (isSpeedDial) {
      return (
        <Box sx={{ position: 'relative' }}>
          <Drawer
            open={settingsOpen}
            onClose={() => setSettingsOpen(false)}
            anchor='right'
            sx={{}}
            slotProps={{
              paper: {
                sx: {
                  display: 'block',
                  height: '100%',
                },
              },
            }}>
            <WidgetSettingsComponent
              widget={widget}
              updateWidgets={updateWidgets}
              onClose={() => setSettingsOpen((s) => !s)}
              widgetIndex={widgetIndex}
            />
          </Drawer>
          <SpeedDial
            sx={{
              position: 'absolute',
              bottom: '1px',
              right: '1px',
            }}
            direction='up'
            ariaLabel='Edit'
            FabProps={{
              size: 'small',
              sx: squareFab,
            }}
            icon={<MenuIcon />}>
            <SpeedDialAction
              slotProps={{
                tooltip: {
                  title: 'Settings',
                },
              }}
              sx={squareFab}
              onClick={() => setSettingsOpen(true)}
              icon={<SettingsIcon />}
            />
            <SpeedDialAction
              onClick={() => {
                updateWidgets(moveLeftWidget(widget))
              }}
              slotProps={{
                tooltip: {
                  title: 'Move Left',
                },
              }}
              sx={squareFab}
              icon={<ArrowLeftIcon />}
            />
            <SpeedDialAction
              onClick={() => {
                updateWidgets(moveRightWidget(widget))
              }}
              slotProps={{
                tooltip: {
                  title: 'Move Right',
                },
              }}
              sx={squareFab}
              icon={<ArrowRightIcon />}
            />
            <SpeedDialAction
              onClick={() => {
                updateWidgets(duplicateWidget(widget))
              }}
              slotProps={{
                tooltip: {
                  title: 'Duplicate',
                },
              }}
              sx={squareFab}
              icon={<ContentCopyIcon />}
            />
            <SpeedDialAction
              onClick={() => {
                updateWidgets(removeWidget(widget))
              }}
              slotProps={{
                tooltip: {
                  title: 'Delete',
                },
              }}
              sx={squareFab}
              icon={<DeleteIcon />}
            />
          </SpeedDial>
          {widgetBody}
        </Box>
      )
    } else {
      return (
        <Box>
          <Drawer
            open={settingsOpen}
            onClose={() => setSettingsOpen(false)}
            anchor='right'
            sx={{}}
            slotProps={{
              paper: {
                sx: {
                  display: 'block',
                },
              },
            }}>
            <WidgetSettingsComponent
              widget={widget}
              updateWidgets={updateWidgets}
              onClose={() => setSettingsOpen((s) => !s)}
              widgetIndex={widgetIndex}
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
    }
  } else if (widget.visible === undefined || widget.visible) {
    return <Box>{widgetBody}</Box>
  } else {
    return el
  }
}
