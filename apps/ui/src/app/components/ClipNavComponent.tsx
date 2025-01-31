import React from 'react'
import { getHexColor, NavigateableClip, UITrack } from '@midi-structor/core'
import { Box, Typography } from '@mui/material'
import { TX_MESSAGE } from '@midi-structor/core'
import _ from 'lodash'
import { Midi } from '@midi-structor/core'
import { ProjectHooks } from '@midi-structor/core'

export type ClipNavComponentProps = {
  track: UITrack
}

export const ClipNavComponent: React.FC<ClipNavComponentProps> = ({ track }) => {
  const activeClip = ProjectHooks.useActiveClip(track)
  const arrangement = ProjectHooks.useArrangement()
  const dawEmitter = Midi.useDawEmitter()

  const cueHash = React.useMemo(() => {
    return _.fromPairs(_.map(arrangement.cues, (cue) => [cue.time, cue]))
  }, [arrangement.cues])

  const clips = React.useMemo(() => {
    const tmpClips: Array<NavigateableClip> = []
    track.clips.forEach((clip) => {
      if (clip.type === 'real') {
        const cue = _.get(cueHash, clip.startTime, undefined)
        if (cue !== undefined) {
          tmpClips.push({ clip, cue })
        }
      }
    })
    return tmpClips
  }, [track, cueHash])

  const onClick = (clip: NavigateableClip) => {
    dawEmitter.send(TX_MESSAGE.jumpToCue(clip.cue.index))
  }

  return (
    <Box
      sx={{
        height: 100,
        display: 'flex',
      }}>
      {clips.map((navClip, clipIndex) => (
        <Box
          key={`section-track-${track.name}-clip-${clipIndex}`}
          sx={{
            display: 'flex',
            '&:hover': {
              border: '1px solid white',
              cursor: 'pointer',
            },
            border: navClip.clip === activeClip ? '2px solid white' : `2px solid transparent`,
            width: 100,
            backgroundColor: getHexColor(navClip.clip),
            alignItems: 'center',
            justifyContent: 'center',
          }}
          onClick={() => onClick(navClip)}>
          <Typography align='center'>{navClip.clip.name}</Typography>
        </Box>
      ))}
    </Box>
  )
}
