import React from 'react'
import { useAtom } from 'jotai/index'
import { editWidgetsAtom } from '../../../../model/Widgets'
import { Box, Button, Drawer, LinearProgress } from '@mui/material'
import { AddWidgetComponent } from '../../../AddWidgetComponent'
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline'
import { ConfiguredController, MidiMessage, MIDIStructorUIWidgets, MidiTarget } from '@midi-structor/core'
import { WidgetsComponent } from './WidgetsComponent'
import { MIDIStructorDeviceUI } from './MIDIStructorDeviceUI'

export type OnClick = (target: MidiTarget) => void

export type MidiStructorComponentProps = {
  configuredController: ConfiguredController
  device: MIDIStructorDeviceUI
}

export const MidiStructorComponent: React.FC<MidiStructorComponentProps> = ({
  configuredController,
  device,
}) => {
  const [widgetOpen, setWidgetOpen] = React.useState(false)
  const [editWidgets, setEditWidgets] = useAtom(editWidgetsAtom)

  const store = device.useStore(configuredController.name).useGet()
  const widgets: MIDIStructorUIWidgets | undefined = React.useMemo(() => {
    const initMaybe = store['init']
    if (initMaybe !== undefined && initMaybe._tag === 'init') {
      return [...initMaybe.widgets]
    } else {
      return undefined
    }
  }, [store])
  const listener = ConfiguredController.useVirtualListener(configuredController)

  const onClick = (target: MidiTarget) => {
    listener.emit(MidiMessage.raw(MidiTarget.toMessage(target, 127)))
  }

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
        {widgets !== undefined ? (
          <WidgetsComponent
            widgets={widgets}
            isEdit={editWidgets}
            onClick={onClick}
            store={store}
          />
        ) : (
          <Box>
            <Box>Loading Widgets...</Box>
            <LinearProgress />
          </Box>
        )}
      </Box>
    </Box>
  )
}
