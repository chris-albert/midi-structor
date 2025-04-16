import React from 'react'
import { Pad } from '../pads/Pad'
import { Color } from '../Color'
import { MidiTarget } from '../../midi/MidiTarget'
import { ProjectHooks } from '../../project/ProjectHooks'
import { UIClip } from '../../project/UIStateDisplay'
import { ControllerWidget } from '../ControllerWidget'
import { Schema } from 'effect'

const validInParent =
  (parentClip: UIClip) =>
  (clip: UIClip): boolean => {
    return (
      parentClip.type === 'real' && parentClip.endTime !== undefined && clip.startTime < parentClip.endTime
    )
  }

export const TrackSectionsWidget = ControllerWidget({
  name: 'track-sections',
  schema: Schema.Struct({
    targets: Schema.Array(MidiTarget.Schema),
    trackName: Schema.String,
    parentTrackName: Schema.String,
  }),
  targets: (w) => [...w.targets],
  component: ({ targets, trackName, parentTrackName = '' }) => {
    const track = ProjectHooks.useTrack(trackName)
    const activeClip = ProjectHooks.useActiveClip(track)
    const parentTrack = ProjectHooks.useTrack(parentTrackName)
    const parentActiveClip = ProjectHooks.useActiveClip(parentTrack)

    const visibleClips: Array<UIClip> = React.useMemo(() => {
      const tmpClips: Array<UIClip> = []
      track.clips.forEach((clip) => {
        if (clip.startTime >= activeClip.startTime) {
          tmpClips.push(clip)
        }
      })
      return tmpClips.filter(validInParent(parentActiveClip))
    }, [track, activeClip, parentActiveClip])

    const pads = targets.map((target, index) => {
      const clip = visibleClips?.[index]

      const color = clip !== undefined && clip.type === 'real' ? clip.color : Color.BLACK
      return (
        <Pad
          key={`track-sections-${index}`}
          color={color}
          target={target}
        />
      )
    })

    return <>{pads}</>
  },
})
