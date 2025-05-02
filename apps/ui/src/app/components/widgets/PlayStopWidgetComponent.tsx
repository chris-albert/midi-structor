import React from 'react'
import { Box } from '@mui/material'
import {
  TX_MESSAGE,
  ProjectHooks,
  Midi,
  StopButtonComponent,
  PlayButtonComponent,
} from '@midi-structor/core'

export type PlayStopWidgetComponentProps = {}

export const PlayStopWidgetComponent: React.FC<
  PlayStopWidgetComponentProps
> = ({}) => {
  const dawEmitter = Midi.useDawEmitter()
  const isPlaying = ProjectHooks.useIsPlaying()

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
