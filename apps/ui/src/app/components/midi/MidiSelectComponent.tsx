import React from 'react'
import { Midi, MidiDeviceType, MidiType } from '@midi-structor/core'
import { MidiDeviceSelectionComponent } from './MidiDeviceSelectionComponent'

type MidiSelectComponentProps = {
  midiType: MidiType
  midiDeviceType: MidiDeviceType
}

export const MidiSelectComponent: React.FC<MidiSelectComponentProps> = ({ midiType, midiDeviceType }) => {
  const midiDevices = Midi.useMidiDevices(midiType, midiDeviceType)

  return <MidiDeviceSelectionComponent midiDevices={midiDevices} />
}
