import React from 'react'
import { MidiDeviceSelection } from '@midi-structor/core'
import { SelectComponent, SelectItem } from '../SelectComponent'
import { Box } from '@mui/material'
import _ from 'lodash'
import { StatusLedComponent } from '../StatusLedComponent'

export type MidiDeviceSelectionComponentProps = {
  midiDevices: MidiDeviceSelection
}

export const MidiDeviceSelectionComponent: React.FC<MidiDeviceSelectionComponentProps> = ({
  midiDevices,
}) => {
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
        pr: 1,
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
