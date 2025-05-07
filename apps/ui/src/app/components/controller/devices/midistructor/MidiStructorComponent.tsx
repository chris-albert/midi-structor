import React from 'react'
import { Box, LinearProgress } from '@mui/material'
import {
  MidiEmitter,
  MIDIStructorStore,
  MIDIStructorUIWidgets,
  MidiTarget,
} from '@midi-structor/core'
import { WidgetsComponent } from './WidgetsComponent'

export type MidiStructorComponentProps = {
  store: MIDIStructorStore
  midiEmitter: MidiEmitter
  editWidgets: boolean
}

export const MidiStructorComponent: React.FC<MidiStructorComponentProps> = ({
  store,
  midiEmitter,
  editWidgets,
}) => {
  const widgets: MIDIStructorUIWidgets | undefined = React.useMemo(() => {
    const initMaybe = store['init']
    if (initMaybe !== undefined && initMaybe._tag === 'init') {
      return [...initMaybe.widgets]
    } else {
      return undefined
    }
  }, [store])

  const onClick = (target: MidiTarget) => {
    midiEmitter.send(MidiTarget.toMessage(target, 127))
  }

  return (
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
  )
}
