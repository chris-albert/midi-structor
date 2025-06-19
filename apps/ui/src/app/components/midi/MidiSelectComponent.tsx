import React from 'react'
import { Midi, MidiDeviceType } from '@midi-structor/core'
import { MidiDeviceSelectionComponent } from './MidiDeviceSelectionComponent'

type MidiSelectComponentProps = {
  midiDeviceType: MidiDeviceType
}

export const MidiSelectComponent: React.FC<MidiSelectComponentProps> = ({
  midiDeviceType,
}) => {
  const midiDevices = Midi.useMidiDevices(midiDeviceType)

  return <MidiDeviceSelectionComponent midiDevices={midiDevices} />
}
