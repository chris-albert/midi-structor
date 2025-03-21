import React from 'react'
import { ControllerWidget } from '../ControllerWidget'
import { MidiTarget } from '../../midi/MidiTarget'
import { Schema } from 'effect'
import { Midi } from '../../midi/GlobalMidi'
import { ProjectHooks } from '../../project/ProjectHooks'
import _ from 'lodash'
import { NavigateableClip, UIRealClip } from '../../project/UIStateDisplay'
import { TX_MESSAGE } from '../../project/AbletonUIMessage'
import { Pad } from '../pads/Pad'

const NavClipsWidgetSchema = Schema.TaggedStruct('nav-clips', {
  targets: Schema.Array(MidiTarget.Schema),
  trackName: Schema.String,
  fromClip: Schema.Number,
  toClip: Schema.Number,
  sort: Schema.optional(Schema.Literal('alphabetical', 'order')),
})

export const NavClipsWidget: ControllerWidget<typeof NavClipsWidgetSchema.Type> = {
  schema: NavClipsWidgetSchema,
  targets: (s) => [...s.targets],
  component: ({ targets, trackName, fromClip, toClip, sort }) => {
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
  },
}
