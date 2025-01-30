import React from 'react'
import { Box, Card, CardContent, CardHeader } from '@mui/material'
import { MonitorPage } from './MonitorPage'
import { MidiSelectComponent } from '../components/midi/MidiSelectComponent'

type MidiPageProps = {}

export const MidiPage: React.FC<MidiPageProps> = () => {
  return (
    <Box>
      <Box
        sx={{
          width: '100%',
          display: 'flex',
          p: 2,
          gap: 2,
          flexGrow: 1,
        }}>
        <Box>
          <Card>
            <CardHeader title='DAW Midi' />
            <CardContent>
              <MidiSelectComponent
                midiType='daw'
                midiDeviceType='input'
              />
              <MidiSelectComponent
                midiType='daw'
                midiDeviceType='output'
              />
            </CardContent>
          </Card>
        </Box>
        <Box>
          <Card>
            <CardHeader title='Controller Midi' />
            <CardContent>
              <MidiSelectComponent
                midiType='controller'
                midiDeviceType='input'
              />
              <MidiSelectComponent
                midiType='controller'
                midiDeviceType='output'
              />
            </CardContent>
          </Card>
        </Box>
      </Box>
      <MonitorPage />
    </Box>
  )
}
