import React from 'react'
import { Box, Typography } from '@mui/material'
import { MidiInput } from '@midi-structor/core'

const INACTIVE_COLOR = '777777'
const INACTIVE_CLIP_NAME = 'Inactive'

export type BodyProps = {
  midiInput: MidiInput
}

export const Body: React.FC<BodyProps> = ({ midiInput }) => {
  const [activeClip, setActiveClip] = React.useState(INACTIVE_CLIP_NAME)
  const [activeColor, setActiveColor] = React.useState(INACTIVE_COLOR)

  React.useEffect(() => {}, [])

  return (
    <Box>
      <Box></Box>
      <Box sx={{ bgcolor: `#${activeColor}` }}>
        <Typography
          variant='h1'
          align='center'>
          {activeClip}
        </Typography>
      </Box>
      <Box></Box>
    </Box>
  )
}
