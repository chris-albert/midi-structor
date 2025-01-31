import React from 'react'
import { Box, Typography } from '@mui/material'
import _ from 'lodash'
import { ProjectHooks } from '@midi-structor/core'

const beatOneColor = 'red'
const beatOtherColor = 'green'
const noBeatColor = '#777777'

export type BarBeatComponentProps = {}

export const BarBeatComponent: React.FC<BarBeatComponentProps> = ({}) => {
  const barBeat = ProjectHooks.useBarBeats()
  const timeSignature = ProjectHooks.useTimeSignature()

  const sizeArr = React.useMemo(() => {
    return Array.from({ length: timeSignature.noteCount }, (v, i) => i + 1)
  }, [timeSignature])

  return (
    <Box
      sx={{
        display: 'flex',
      }}>
      {_.map(sizeArr, (index) => (
        <Box
          sx={{
            border: '1px solid black',
            height: 100,
            width: 100,
            backgroundColor:
              barBeat === index ? (barBeat === 1 ? beatOneColor : beatOtherColor) : noBeatColor,
          }}
          key={`bar-beat-${index}`}>
          <Typography
            align='center'
            variant='h1'>
            {index}
          </Typography>
        </Box>
      ))}
    </Box>
  )
}
