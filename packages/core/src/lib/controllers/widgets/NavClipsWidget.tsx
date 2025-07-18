import React from 'react'
import { ControllerWidget } from '../ControllerWidget'
import { MidiTarget } from '../../midi/MidiTarget'
import { Schema } from 'effect'
import { ProjectHooks } from '../../project/ProjectHooks'
import _ from 'lodash'
import { NavigateableClip, UIRealClip } from '../../project/UIStateDisplay'
import { TX_MESSAGE } from '../../project/AbletonUIMessage'
import { Pad } from '../pads/Pad'
import { DawMidi } from '../../midi/DawMidi'

export const NavClipsWidget = ControllerWidget.many({
  name: 'nav-clips',
  schema: Schema.Struct({
    trackName: Schema.String,
    sort: Schema.optional(Schema.Literal('alphabetical', 'order')),
  }),
  init: () => ({
    trackName: 'Nav Clip Track',
    sort: 'order' as const,
  }),
  tracks: (w) => [w.trackName],
  component: ({ targets, trackName, sort }) => {
    const dawEmitter = DawMidi.useDawEmitter()
    const arrangement = ProjectHooks.useArrangement()
    const track = ProjectHooks.useTrack(trackName)
    const activeClip = ProjectHooks.useActiveClip(track)

    const cueHash = React.useMemo(() => {
      return _.fromPairs(_.map(arrangement.cues, (cue) => [cue.time, cue]))
    }, [arrangement.cues])

    const unsortedClips: Array<UIRealClip> = track.clips.filter(
      (c) => c.type === 'real'
    ) as Array<UIRealClip>
    const realClips: Array<UIRealClip> =
      sort === 'alphabetical'
        ? unsortedClips.sort((l, r) => l.name.localeCompare(r.name))
        : unsortedClips

    const clips = React.useMemo(() => {
      const tmpClips: Array<NavigateableClip & { target: MidiTarget }> = []
      for (let index = 0; index < realClips.length; index++) {
        const target = targets?.[index]
        const clip = realClips?.[index]
        if (clip !== undefined && target !== undefined) {
          const cue = cueHash?.[clip.startTime]
          if (cue !== undefined) {
            tmpClips.push({ clip, cue, target })
          }
        }
      }
      return tmpClips
    }, [track, cueHash, targets])

    const onClick = (clip: NavigateableClip) => {
      dawEmitter.send(TX_MESSAGE.jumpToCue(clip.cue.index))
    }

    const pads = clips.map((clip, index) => (
      <Pad
        isFlashing={clip.clip === activeClip}
        key={`song-${index}-${clip.clip.name}`}
        color={clip.clip.color}
        target={clip.target}
        onClick={() => onClick(clip)}
        options={{
          label: clip.clip.name,
        }}
      />
    ))

    return <>{pads}</>
  },
})
