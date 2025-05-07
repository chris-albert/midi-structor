import React from 'react'
import { Midi, ProjectMidi } from '@midi-structor/core'
import { MidiStructorComponent } from '../components/controller/devices/midistructor/MidiStructorComponent'
import { Box } from '@mui/material'

export type UIPageProps = {}

export const UIPage: React.FC<UIPageProps> = ({}) => {
  const store = ProjectMidi.useGlobalMidiStructorStore().useGet()
  const emitter = Midi.useDawEmitter()

  React.useEffect(() => {
    const init = store['init']
    if (init === undefined) {
    }
  }, [store])

  return (
    <Box sx={{ m: 2 }}>
      <MidiStructorComponent
        store={store}
        midiEmitter={emitter}
        editWidgets={false}
      />
    </Box>
  )
}
