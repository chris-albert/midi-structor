import React from 'react'
import { Pad } from '../pads/Pad'
import { Color } from '../Color'
import { ProjectHooks } from '../../project/ProjectHooks'
import { UIClip } from '../../project/UIStateDisplay'
import { ControllerWidget } from '../ControllerWidget'
import { Schema } from 'effect'

const validInParent =
  (parentClip: UIClip) =>
  (clip: UIClip): boolean => {
    return (
      parentClip.type === 'real' &&
      parentClip.endTime !== undefined &&
      clip.startTime < parentClip.endTime
    )
  }

export const TrackSectionsWidget = ControllerWidget.many({
  name: 'track-sections',
  schema: Schema.Struct({
    trackName: Schema.String,
    parentTrackName: Schema.String,
  }),
  init: () => ({
    trackName: 'Track Sections',
    parentTrackName: 'Parent Track Sections',
  }),
  tracks: (w) => [w.trackName, w.parentTrackName],
  component: ({ targets, trackName, parentTrackName = '' }) => {
    const track = ProjectHooks.useTrack(trackName)
    const activeClip = ProjectHooks.useActiveClip(track)
    const parentTrack = ProjectHooks.useTrack(parentTrackName)
    const parentActiveClip = ProjectHooks.useActiveClip(parentTrack)
    const beat = ProjectHooks.useBeat()

    const visibleClips: Array<UIClip> = React.useMemo(() => {
      const tmpClips: Array<UIClip> = []
      track.clips.forEach((clip) => {
        if (clip.startTime >= activeClip.startTime) {
          tmpClips.push(clip)
        }
      })
      return tmpClips.filter(validInParent(parentActiveClip))
    }, [track, activeClip, parentActiveClip])

    const progress: number | undefined = React.useMemo(() => {
      if (activeClip && activeClip.endTime !== undefined) {
        const total = activeClip.endTime - activeClip.startTime
        const fromStart = beat - activeClip.startTime
        return (fromStart / total) * 100
      } else {
        return undefined
      }
    }, [activeClip, beat])

    const pads = targets.map((target, index) => {
      const clip = visibleClips?.[index]

      const color =
        clip !== undefined && clip.type === 'real' ? clip.color : Color.BLACK
      const label = clip !== undefined && clip.type === 'real' ? clip.name : ''
      return (
        <Pad
          key={`track-sections-${index}`}
          color={color}
          target={target}
          options={{
            label,
            progress,
            isActive: clip === activeClip,
          }}
        />
      )
    })

    return <>{pads}</>
  },
})
