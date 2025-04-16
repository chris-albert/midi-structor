import React from 'react'
import { Pad } from '../pads/Pad'
import { Color } from '../Color'
import { MidiTarget } from '../../midi/MidiTarget'
import { ProjectHooks } from '../../project/ProjectHooks'
import { UIClipsOps } from '../../project/UIStateDisplay'
import { ControllerWidget } from '../ControllerWidget'
import { Schema } from 'effect'

const accidentalNotes = [undefined, 'c#', 'd#', undefined, 'f#', 'g#', 'a#']
const notes = ['c', 'd', 'e', 'f', 'g', 'a', 'b', 'c']

export const KeyBoardWidget = ControllerWidget({
  name: 'keyboard',
  schema: Schema.Struct({
    topTargets: Schema.Array(MidiTarget.Schema),
    bottomTargets: Schema.Array(MidiTarget.Schema),
    trackName: Schema.String,
  }),
  targets: (w) => [...w.topTargets, ...w.bottomTargets],
  component: ({ topTargets, bottomTargets, trackName }) => {
    const track = ProjectHooks.useTrack(trackName)

    const activeClip = ProjectHooks.useActiveClip(track)

    const note = React.useMemo(() => {
      if (UIClipsOps.isReal(activeClip)) {
        return activeClip.name.toLowerCase()
      } else {
        return undefined
      }
    }, [activeClip])

    const isActive = (padNote: string | undefined): boolean => {
      if (padNote === undefined || note === undefined) {
        return false
      } else {
        return padNote === note
      }
    }

    const onClick = (note: string | undefined) => () => {}
    const topPads = topTargets.map((target, index) => {
      const accidental = accidentalNotes?.[index]
      return (
        <Pad
          key={`keyboard-top-${index}`}
          color={accidental !== undefined ? Color.BLUE : Color.BLACK}
          target={target}
          isFlashing={isActive(accidental)}
          onClick={onClick(accidental)}
        />
      )
    })
    const bottomPads = bottomTargets.map((target, index) => {
      const note = notes?.[index]
      return (
        <Pad
          key={`keyboard-bottom-${index}`}
          color={note !== undefined ? Color.PURPLE : Color.BLACK}
          target={target}
          isFlashing={isActive(note)}
          onClick={onClick(note)}
        />
      )
    })
    return (
      <>
        {topPads}
        {bottomPads}
      </>
    )
  },
})
