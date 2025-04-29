import React from 'react'
import { Midi, MIDIStructorUI, ProjectMidi } from '@midi-structor/core'
import { MidiStructorComponent } from '../components/controller/devices/midistructor/MidiStructorComponent'

export type UIPageProps = {}

export const UIPage: React.FC<UIPageProps> = ({}) => {
  const store = ProjectMidi.useGlobalMidiStructorStore().useGet()
  const emitter = Midi.useDawEmitter()
  return (
    <MidiStructorComponent
      store={store}
      midiEmitter={emitter}
    />
  )
}
