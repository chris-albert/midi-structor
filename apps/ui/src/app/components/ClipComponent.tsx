import React from 'react'
import { PrimitiveAtom, useAtomValue } from 'jotai'
import { getHexColor, UIClip } from '@midi-structor/core'
import { Box } from '@mui/material'
import { zoomAtom } from '../model/Settings'

export type ClipComponentProps = {
  clipAtom: PrimitiveAtom<UIClip>
}

export const ClipComponent: React.FC<ClipComponentProps> = ({ clipAtom }) => {
  const clip = useAtomValue(clipAtom)
  const zoom = useAtomValue(zoomAtom)

  const width = clip.endTime === undefined ? 100 : (clip.endTime - clip.startTime) * 10 * (1 + zoom / 10)

  if (clip.type === 'real') {
    return (
      <Box
        sx={{
          '&:hover': {
            border: '1px solid white',
            cursor: 'pointer',
          },
          width: width,
          height: '100%',
          backgroundColor: getHexColor(clip),
        }}>
        <Box sx={{ p: 1 }}>{clip.name}</Box>
      </Box>
    )
  } else {
    return (
      <Box
        sx={{
          width: width,
          height: '100%',
        }}>
        <Box sx={{ p: 1 }}></Box>
      </Box>
    )
  }
}
