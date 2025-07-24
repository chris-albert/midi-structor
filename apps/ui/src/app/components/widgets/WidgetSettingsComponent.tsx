import React from 'react'
import {
  duplicateWidget,
  moveLeftWidget,
  moveRightWidget,
  removeWidget,
  replaceWidget,
} from '../../model/Widgets'
import {
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  Typography,
} from '@mui/material'
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
  ProjectHooks,
  SchemaHelper,
} from '@midi-structor/core'
import CloseIcon from '@mui/icons-material/Close'
import { WidgetSettingsFormComponent } from './WidgetSettingsFormComponent'
import _ from 'lodash'

export type WidgetSettingsComponentProps = {
  widget: MIDIStructorUIWidget
  updateWidgets: MIDIStructorUIWidgetsUpdate
  onClose: () => void
  widgetIndex: number
}

export const WidgetSettingsComponent: React.FC<
  WidgetSettingsComponentProps
> = ({ widget, updateWidgets, onClose, widgetIndex }) => {
  const [viewRaw, setViewRaw] = React.useState(false)
  const projectStyle = ProjectHooks.useProjectStyle()

  const [settings, setSettings] = React.useState(
    SchemaHelper.encode(AllMidiStructorWidgets.all.schema, widget)
  )

  // @ts-ignore
  const config: MIDIStructorWidget<any, any> =
    // @ts-ignore
    AllMidiStructorWidgets.all.getByName(widget._tag)

  const onWidgetSave = () => {
    SchemaHelper.decodeString({
      schema: AllMidiStructorWidgets.all.schema,
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
    <Card sx={{ minHeight: '100%' }}>
      <CardHeader
        action={
          <IconButton
            aria-label='delete'
            onClick={onClose}>
            <CloseIcon />
          </IconButton>
        }
        title={_.startCase(widget._tag)}
      />
      <CardContent
        sx={{
          display: 'flex',
          flexDirection: 'column',
          height: '100%',
        }}>
        <Box sx={{ flex: '1 0 auto' }}>
          <WidgetSettingsFormComponent
            widget={widget}
            config={config}
            settings={settings}
            setSettings={setSettings}
          />
          {viewRaw ? (
            <JSONEditor
              height='300px'
              width='505px'
              readonly={false}
              onChange={setSettings}
              value={settings}
            />
          ) : null}
        </Box>
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            flexShrink: 0,
          }}>
          <Box>
            {/*<IconButton*/}
            {/*  onClick={() => {*/}
            {/*    updateWidgets(removeWidget(widget))*/}
            {/*  }}*/}
            {/*  aria-label='Remove Widget'>*/}
            {/*  <DeleteIcon />*/}
            {/*</IconButton>*/}
            {/*<IconButton*/}
            {/*  onClick={() => {*/}
            {/*    updateWidgets(duplicateWidget(widget))*/}
            {/*  }}*/}
            {/*  aria-label='Duplicate'>*/}
            {/*  <ContentCopyIcon />*/}
            {/*</IconButton>*/}
            {/*<IconButton*/}
            {/*  disabled={widgetIndex === 0}*/}
            {/*  onClick={() => {*/}
            {/*    updateWidgets(moveLeftWidget(widget))*/}
            {/*  }}*/}
            {/*  aria-label='Move Left'>*/}
            {/*  <ArrowLeftIcon />*/}
            {/*</IconButton>*/}
            {/*<IconButton*/}
            {/*  onClick={() => {*/}
            {/*    updateWidgets(moveRightWidget(widget))*/}
            {/*  }}*/}
            {/*  aria-label='Move Right'>*/}
            {/*  <ArrowRightIcon />*/}
            {/*</IconButton>*/}
          </Box>
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'row',
              justifyContent: 'center',
              alignItems: 'center',
              gap: 2,
            }}>
            <Typography
              sx={{
                cursor: 'pointer',
                fontSize: '.7em',
              }}
              onClick={() => {
                setViewRaw((r) => !r)
              }}>
              {viewRaw ? 'Hide' : 'View'} Raw
            </Typography>
            <Button
              onClick={() => {
                onWidgetSave()
              }}
              sx={{
                background: projectStyle.offsetGradient,
              }}
              variant='contained'
              size='small'>
              Save
            </Button>
          </Box>
        </Box>
      </CardContent>
    </Card>
  )
}
