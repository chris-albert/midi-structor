import React from 'react'
import {
  Card,
  CardContent,
  CardHeader,
  Divider,
  Typography,
  Box,
  Button,
} from '@mui/material'
import { ProjectHooks } from '@midi-structor/core'
import { MidiSelectComponent } from '../midi/MidiSelectComponent'
import { useNavigate } from 'react-router-dom'

export type GlobalSettingsComponentProps = {}

export const GlobalSettingsComponent: React.FC<
  GlobalSettingsComponentProps
> = ({}) => {
  const projectStyle = ProjectHooks.useProjectStyle()
  const navigate = useNavigate()

  return (
    <Card
      sx={{
        minWidth: '500px',
      }}>
      <CardHeader
        title='Global Settings'
        sx={{
          background: projectStyle.offsetGradient,
        }}
      />
      <CardContent>
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            gap: 2,
          }}>
          <Typography variant='h6'>DAW MIDI</Typography>
          <Divider />
          <MidiSelectComponent midiDeviceType='input' />
          <MidiSelectComponent midiDeviceType='output' />
          <Button
            size='small'
            sx={{
              background: projectStyle.offsetGradient,
            }}
            onClick={() => {
              navigate('/midi')
            }}
            variant='contained'>
            MIDI Monitor
          </Button>
        </Box>
      </CardContent>
    </Card>
  )
}
