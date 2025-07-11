import React from 'react'
import { DawMidi, MidiStructorStore } from '@midi-structor/core'
import { MidiStructorComponent } from '../components/controller/devices/midistructor/MidiStructorComponent'
import { Box } from '@mui/material'

export type UIPageProps = {}

export const UIPage: React.FC<UIPageProps> = ({}) => {
  const store = MidiStructorStore.uiStore('global:MIDIStructorUI')
  const emitter = DawMidi.useDawEmitter()
  const dawListener = DawMidi.useDawListener()
  const onMidiStructor = store.put()

  React.useEffect(() => {
    return dawListener.on('sysex', onMidiStructor)
  }, [dawListener])

  return (
    <Box sx={{ m: 2 }}>
      <MidiStructorComponent
        store={store.useGet()}
        midiEmitter={emitter}
        editWidgets={false}
        updateWidgets={(w) => w}
      />
    </Box>
  )
}
