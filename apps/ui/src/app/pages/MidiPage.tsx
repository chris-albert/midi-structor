import React from 'react'
import { Box, Button, Card, CardContent, CardHeader } from '@mui/material'
import { MonitorPage } from './MonitorPage'
import { MidiSelectComponent } from '../components/midi/MidiSelectComponent'
import { GetDevicesMessage, HealthMessage, Midi, AgentMidi } from '@midi-structor/core'

type MidiPageProps = {}

export const MidiPage: React.FC<MidiPageProps> = () => {
  const agentEmitter = Midi.useAgentEmitter()
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
        <Box>
          <Card>
            <CardHeader title='Agent Midi' />
            <CardContent>
              <MidiSelectComponent
                midiType='agent'
                midiDeviceType='input'
              />
              <MidiSelectComponent
                midiType='agent'
                midiDeviceType='output'
              />
            </CardContent>
            <Button
              onClick={() => {
                // agentEmitter.send(AgentMidi.message(HealthMessage.make({})))
                agentEmitter.send(AgentMidi.message(GetDevicesMessage.make({})))
              }}>
              Test
            </Button>
          </Card>
        </Box>
      </Box>
      <MonitorPage />
    </Box>
  )
}
