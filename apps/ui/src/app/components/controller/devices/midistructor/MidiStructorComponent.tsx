import React from 'react'
import { Box, LinearProgress } from '@mui/material'
import {
  MidiEmitter,
  MIDIStructorStore,
  MIDIStructorUIWidgets,
  MIDIStructorUIWidgetsUpdate,
  MidiTarget,
} from '@midi-structor/core'
import { WidgetsComponent } from './WidgetsComponent'

export type MidiStructorComponentProps = {
  store: MIDIStructorStore
  midiEmitter: MidiEmitter
  editWidgets: boolean
  updateWidgets: MIDIStructorUIWidgetsUpdate
}

export const MidiStructorComponent: React.FC<MidiStructorComponentProps> = ({
  store,
  midiEmitter,
  editWidgets,
  updateWidgets,
}) => {
  const widgets: MIDIStructorUIWidgets | undefined = React.useMemo(() => {
    const initMaybe = store['init']
    if (initMaybe !== undefined && initMaybe._tag === 'init') {
      return [...initMaybe.widgets]
    } else {
      return undefined
    }
  }, [store])

  const onClick = (target: MidiTarget, data?: any) => {
    midiEmitter.send(MidiTarget.toMessage(target, data || 127))
  }

  return (
    <Box>
      {widgets !== undefined ? (
        <WidgetsComponent
          widgets={widgets}
          isEdit={editWidgets}
          onClick={onClick}
          store={store}
          updateWidgets={updateWidgets}
        />
      ) : (
        <Box>
          <Box>Loading Widgets...</Box>
          <LinearProgress />
        </Box>
      )}
    </Box>
  )
}
