import React from 'react'
import _ from 'lodash'
import { Pad } from '../pads/Pad'
import { MidiTarget } from '../../midi/MidiTarget'
import { ProjectHooks } from '../../project/ProjectHooks'
import { Midi } from '../../midi/GlobalMidi'
import { NavigateableClip, UIRealClip } from '../../project/UIStateDisplay'
import { TX_MESSAGE } from '../../project/AbletonUIMessage'

type SongsWidgetProps = {
  targets: Array<MidiTarget>
  trackName: string
  fromClip: number
  toClip: number
  sort: 'alphabetical' | 'order'
}

export const SongsWidget: React.FC<SongsWidgetProps> = ({ targets, trackName, fromClip, toClip, sort }) => {
  const dawEmitter = Midi.useDawEmitter()
  const arrangement = ProjectHooks.useArrangement()
  const track = ProjectHooks.useTrack(trackName)
  const activeClip = ProjectHooks.useActiveClip(track)

  const cueHash = React.useMemo(() => {
    return _.fromPairs(_.map(arrangement.cues, (cue) => [cue.time, cue]))
  }, [arrangement.cues])

  const unsortedClips: Array<UIRealClip> = track.clips.filter((c) => c.type === 'real') as Array<UIRealClip>
  const realClips: Array<UIRealClip> =
    sort === 'alphabetical' ? unsortedClips.sort((l, r) => l.name.localeCompare(r.name)) : unsortedClips

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
