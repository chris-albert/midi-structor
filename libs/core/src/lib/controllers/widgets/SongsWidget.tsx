import React from 'react'
import _ from 'lodash'
import { Pad } from '../pads/Pad'
import { Midi, MidiTarget, NavigateableClip, ProjectHooks, TX_MESSAGE, UIRealClip } from '@midi-structor/core'

type SongsWidgetProps = {
  targets: Array<MidiTarget>
  trackName: string
  fromClip: number
  toClip: number
}

export const SongsWidget: React.FC<SongsWidgetProps> = ({ targets, trackName, fromClip, toClip }) => {
  const dawEmitter = Midi.useDawEmitter()
  const arrangement = ProjectHooks.useArrangement()
  const track = ProjectHooks.useTrack(trackName)
  const activeClip = ProjectHooks.useActiveClip(track)

  const cueHash = React.useMemo(() => {
    return _.fromPairs(_.map(arrangement.cues, (cue) => [cue.time, cue]))
  }, [arrangement.cues])

  const realClips: Array<UIRealClip> = track.clips.filter((c) => c.type === 'real') as Array<UIRealClip>

  const clips = React.useMemo(() => {
    const tmpClips: Array<NavigateableClip & { target: MidiTarget }> = []
    for (let index = fromClip; index <= toClip; index++) {
      const targetIndex = index - fromClip
      const target = targets?.[targetIndex]
      const clip = realClips?.[index]
      if (clip !== undefined && target !== undefined) {
        const cue = cueHash?.[clip.startTime]
        if (cue !== undefined) {
          tmpClips.push({ clip, cue, target })
        }
      }
    }
    return tmpClips
  }, [track, cueHash, targets, fromClip, toClip])

  const onClick = (clip: NavigateableClip) => {
    dawEmitter.send(TX_MESSAGE.jumpToCue(clip.cue.index))
  }

  const pads = clips.map((clip, index) => (
    <Pad
      isFlashing={clip.clip === activeClip}
      key={`song-${index}`}
      color={clip.clip.color}
      target={clip.target}
      onClick={() => onClick(clip)}
    />
  ))

  return <>{pads}</>
}
