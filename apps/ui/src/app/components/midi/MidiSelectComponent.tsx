import React from 'react'
import { Box } from '@mui/material'
import { SelectComponent, SelectItem } from '../SelectComponent'
import { StatusLedComponent } from '../StatusLedComponent'
import { Midi, MidiDeviceType, MidiType } from '@midi-structor/core'
import _ from 'lodash'
import { MidiDeviceSelectionComponent } from './MidiDeviceSelectionComponent'

type MidiSelectComponentProps = {
  midiType: MidiType
  midiDeviceType: MidiDeviceType
}

export const MidiSelectComponent: React.FC<MidiSelectComponentProps> = ({ midiType, midiDeviceType }) => {
  const midiDevices = Midi.useMidiDevices(midiType, midiDeviceType)

  return <MidiDeviceSelectionComponent midiDevices={midiDevices} />
}
