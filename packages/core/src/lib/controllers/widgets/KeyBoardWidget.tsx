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

export const KeyBoardWidget = ControllerWidget.of({
  name: 'keyboard',
  schema: Schema.Struct({
    topTargets: Schema.Array(MidiTarget.Schema),
    bottomTargets: Schema.Array(MidiTarget.Schema),
    trackName: Schema.String,
    topColor: Color.Schema,
    bottomColor: Color.Schema,
  }),
  init: () => ({
    topTargets: [],
    bottomTargets: [],
    trackName: 'Keyboard Track',
    topColor: Color.GREEN,
    bottomColor: Color.RED,
  }),
  targets: (w) => ({
    _tag: 'many',
    targets: [...w.topTargets, ...w.bottomTargets],
  }),
  inputType: 'many',
  tracks: (w) => [w.trackName],
  component: ({
    topTargets,
    bottomTargets,
    trackName,
    topColor,
    bottomColor,
  }) => {
    const track = ProjectHooks.useTrack(trackName)

    const activeClip = ProjectHooks.useActiveClip(track)

    const [note, noteColor] = React.useMemo(() => {
      if (UIClipsOps.isReal(activeClip)) {
        return [activeClip.name.toLowerCase(), activeClip.color]
      } else {
        return [undefined, undefined]
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
          color={
            accidental !== undefined
              ? isActive(accidental) && noteColor !== undefined
                ? noteColor
                : topColor
              : Color.BLACK
          }
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
          color={
            note !== undefined
              ? isActive(note) && noteColor !== undefined
                ? noteColor
                : bottomColor
              : Color.BLACK
          }
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
