import React from 'react'
import {
  duplicateWidget,
  moveLeftWidget,
  moveRightWidget,
  removeWidget,
  replaceWidget,
} from '../../model/Widgets'
import { Box, Button, Card, CardContent, CardHeader } from '@mui/material'
import { JSONEditor } from '../JSONEditor'
import { toast } from 'react-toastify'
import IconButton from '@mui/material/IconButton'
import ArrowLeftIcon from '@mui/icons-material/ArrowLeftOutlined'
import ContentCopyIcon from '@mui/icons-material/ContentCopy'
import ArrowRightIcon from '@mui/icons-material/ArrowRightOutlined'
import DeleteIcon from '@mui/icons-material/Delete'
import {
  AllMidiStructorWidgets,
  MIDIStructorUIWidget,
  MIDIStructorUIWidgetsUpdate,
  MIDIStructorWidget,
  SchemaHelper,
} from '@midi-structor/core'
import CloseIcon from '@mui/icons-material/Close'
import { WidgetSettingsFormComponent } from './WidgetSettingsFormComponent'

export type WidgetSettingsComponentProps = {
  widget: MIDIStructorUIWidget
  updateWidgets: MIDIStructorUIWidgetsUpdate
  onClose: () => void
}

export const WidgetSettingsComponent: React.FC<
  WidgetSettingsComponentProps
> = ({ widget, updateWidgets, onClose }) => {
  const [settings, setSettings] = React.useState(
    SchemaHelper.encode(AllMidiStructorWidgets.schema, widget)
  )

  // @ts-ignore
  const config: MIDIStructorWidget<any, any> = AllMidiStructorWidgets.getByName(
    widget._tag
  )

  const onWidgetSave = () => {
    SchemaHelper.decodeString({
      schema: AllMidiStructorWidgets.schema,
      str: settings,
      ok: (newWidget) => {
        updateWidgets(replaceWidget(widget, newWidget))
        toast.success('Widget saved')
      },
      error: (msg) => {
        toast.error(msg)
      },
    })
  }

  return (
    <Card>
      <CardHeader
        action={
          <IconButton
            aria-label='delete'
            onClick={onClose}>
            <CloseIcon />
          </IconButton>
        }
        title={widget._tag}
      />
      <CardContent>
        <WidgetSettingsFormComponent
          widget={widget}
          config={config}
          settings={settings}
          setSettings={setSettings}
        />
        <JSONEditor
          height='300px'
          width='505px'
          readonly={false}
          onChange={setSettings}
          value={settings}
        />
        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
          <Box>
            <IconButton
              onClick={() => {
                updateWidgets(removeWidget(widget))
              }}
              aria-label='Remove Widget'>
              <DeleteIcon />
            </IconButton>
            <IconButton
              onClick={() => {
                updateWidgets(duplicateWidget(widget))
              }}
              aria-label='Duplicate'>
              <ContentCopyIcon />
            </IconButton>
            <IconButton
              onClick={() => {
                updateWidgets(moveLeftWidget(widget))
              }}
              aria-label='Move Left'>
              <ArrowLeftIcon />
            </IconButton>
            <IconButton
              onClick={() => {
                updateWidgets(moveRightWidget(widget))
              }}
              aria-label='Move Right'>
              <ArrowRightIcon />
            </IconButton>
          </Box>
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
            }}>
            <Button
              onClick={() => {
                onWidgetSave()
              }}
              variant='outlined'
              size='small'>
              Save
            </Button>
          </Box>
        </Box>
      </CardContent>
    </Card>
  )
}
