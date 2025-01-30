import React from 'react'
import { Box } from '@mui/material'
import { PlayButtonComponent } from '../PlayButtonComponent'
import { StopButtonComponent } from '../StopButtonComponent'
import { TX_MESSAGE } from '../../model/AbletonUIMessage'
import { Midi } from '../../midi/GlobalMidi'
import { useIsPlaying } from '../../hooks/RealTimeHooks'

export type PlayStopWidgetComponentProps = {}

export const PlayStopWidgetComponent: React.FC<PlayStopWidgetComponentProps> = ({}) => {
  const dawEmitter = Midi.useDawEmitter()
  const isPlaying = useIsPlaying()

  const onClick = (play: boolean) => {
    if (play) {
      dawEmitter.send(TX_MESSAGE.play())
    } else {
      dawEmitter.send(TX_MESSAGE.stop())
    }
  }

  return (
    <Box
      sx={{
        height: 100,
        width: '100%',
      }}>
      {isPlaying ? (
        <StopButtonComponent onStop={() => onClick(false)} />
      ) : (
        <PlayButtonComponent onPlay={() => onClick(true)} />
      )}
    </Box>
  )
}
