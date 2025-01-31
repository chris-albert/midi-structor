import React from 'react'
import { Box } from '@mui/material'
import { SelectComponent, SelectItem } from '../SelectComponent'
import { StatusLedComponent } from '../StatusLedComponent'
import { Midi, MidiDeviceType, MidiType } from '@midi-structor/core'
import _ from 'lodash'

type MidiSelectComponentProps = {
  midiType: MidiType
  midiDeviceType: MidiDeviceType
}

export const MidiSelectComponent: React.FC<MidiSelectComponentProps> = ({ midiType, midiDeviceType }) => {
  const midiDevices = Midi.useMidiDevices(midiType, midiDeviceType)

  const [items, setItems] = React.useState<Array<SelectItem>>([])

  React.useEffect(() => {
    setItems(
      midiDevices.devices.map((name) => {
        return {
          label: name,
          value: name,
        }
      }),
    )
  }, [midiDevices.devices])

  const onMidiSelect = (output: string | undefined) => {
    midiDevices.setSelected(output)
  }

  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
      }}>
      <SelectComponent
        label={`MIDI ${_.capitalize(midiDevices.type)}`}
        items={items}
        onChange={onMidiSelect}
        activeLabel={midiDevices.selected}
      />
      <StatusLedComponent on={false} />
    </Box>
  )
}
