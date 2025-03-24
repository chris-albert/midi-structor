import React from 'react'
import { Pad } from '../pads/Pad'
import { Color } from '../Color'
import { MidiTarget } from '../../midi/MidiTarget'
import { ProjectHooks } from '../../project/ProjectHooks'
import { UIClipsOps } from '../../project/UIStateDisplay'
import { ControllerWidget } from '../ControllerWidget'
import { Midi } from '../../midi/GlobalMidi'
import { TX_MESSAGE } from '../../project/AbletonUIMessage'
import { Schema } from 'effect'

/**
 * | GB  | BB | DIFF | Count |
 * -----------
 * 4/4 part
 * ------------
 * | 0   | 1  | 0 | 0 |
 * | 1   | 2  | 1 | 0 |
 * | 2   | 3  | 2 | 0 |
 * | 3   | 4  | 3 | 0 |
 * | 4   | 1  | 4 | 1 |
 * | 5   | 2  | 5 | 1 |
 * | 6   | 3  | 6 | 1 |
 * | 7   | 4  | 7 | 1 |
 * ------------
 * 6/8 part
 * ------------
 * | 128 | 1  | 0 | 0 |
 * | 128 | 2  | 0 | 0 |
 * | 129 | 3  | 1 | 0 |
 * | 129 | 4  | 1 | 0 |
 * | 130 | 5  | 2 | 0 |
 * | 130 | 6  | 2 | 0 |
 * | 131 | 1  | 3 | 1 |
 * | 131 | 2  | 3 | 1 |
 * ------------
 * 5/8 part
 * ------------
 * | 248 | 1  | 0 | 0 |
 * | 248 | 2  | 0 | 0 |
 * | 249 | 3  | 1 | 0 |
 * | 249 | 4  | 1 | 0 |
 * | 250 | 5  | 2 | 0 |
 * | 250 | 1  | 2 | 1 |
 * | 251 | 2  | 3 | 1 |
 * | 251 | 3  | 3 | 1 |
 * | 252 | 4  | 4 | 1 |
 * | 252 | 5  | 4 | 1 |
 * | 253 | 1  | 5 | 2 |
 * | 253 | 2  | 5 | 2 |
 * | 254 | 3  | 6 | 2 |
 * | 254 | 4  | 6 | 2 |
 * | 255 | 5  | 7 | 2 |
 * | 255 | 1  | 7 | 3 |
 *
 * For the 5/8 its more complicated, i need an algo that does
 * x  - o
 * 0  - 0
 * 2  - 1
 * 5  - 2
 * 7  - 3
 * 10 - 4
 * 12 - 5
 * 15 - 6
 *
 * if x % 5 === 0
 *    Math.floor(DIFF / 5) * 2
 * else
 *    Math.floor(((DIFF + .5) * 2) / 5)
 *
 * if BB === 1
 *   if 4/4
 *     Math.floor(DIFF / 4)
 *   if 6/8
 *     Math.floor(DIFF / 3)
 *   if 5/8
 *     Math.floor(Diff / 2.5)
 *
 * Ok maybe we have it, lets try 3/8 and 7/8
 *
 *
 * 3/8
 * | 0 | 1 | 0 |
 * | 0 | 2 | 0 |
 * | 1 | 3 | 0 |
 * | 1 | 1 | 1 |
 * | 2 | 2 | 1 |
 * | 2 | 3 | 1 |
 * | 3 | 1 | 2 |
 * | 3 | 2 | 2 |
 * | 4 | 3 | 2 |
 * | 4 | 1 | 3 |
 * | 5 | 2 | 3 |
 * | 6 | 3 | 3 |
 * | 6 | 1 | 4 |
 *
 * 7/8
 * | 0  | 1 | 0 |
 * | 0  | 2 | 0 |
 * | 1  | 3 | 0 |
 * | 1  | 4 | 0 |
 * | 2  | 5 | 0 |
 * | 2  | 6 | 0 |
 * | 3  | 7 | 0 |
 * | 3  | 1 | 1 |
 * | 4  | 2 | 1 |
 * | 4  | 3 | 1 |
 * | 5  | 4 | 1 |
 * | 5  | 5 | 1 |
 * | 6  | 6 | 1 |
 * | 6  | 7 | 1 |
 * | 7  | 1 | 2 |
 * | 7  | 2 | 2 |
 * | 8  | 3 | 2 |
 * | 8  | 4 | 2 |
 * | 9  | 5 | 2 |
 * | 9  | 6 | 2 |
 * | 10 | 7 | 2 |
 * | 10 | 1 | 3 |
 *
 * Ok we got it, we just need to define some vars
 * GB = Global Beat
 * BB = Bar Beat
 * DIFF = GB - (Start of active clip)
 * TSC = Time Sig Count, the numerator in the time sig
 * TSL = Time Sig Length, the denominator in the time sig
 * if TSL === 4
 *  Math.floor(DIFF / TSC)
 * if TSC % 2 === 0
 *  Math.floor(DIFF / (TSC / 2))
 * else
 *    if DIFF % TSC === 0
 *      Math.floor(DIFF / TSC) * 2
 *    else
 *      Math.floor(((DIFF + .5) * 2) / TSC)
 */

export const BarTrackerWidget = ControllerWidget({
  name: 'bar-tracker',
  schema: Schema.TaggedStruct('bar-tracker', {
    targets: Schema.Array(MidiTarget.Schema),
    trackName: Schema.String,
    color: Color.Schema,
  }),
  targets: (w) => [...w.targets],
  component: ({ targets, trackName, color }) => {
    const track = ProjectHooks.useTrack(trackName)
    const beat = ProjectHooks.useBeat()
    const barBeat = ProjectHooks.useBarBeats()
    const activeClip = ProjectHooks.useActiveClip(track)
    const timeSig = ProjectHooks.useTimeSignature()

    const [barsSinceStart, setBarsSinceStart] = React.useState(0)

    const count = React.useMemo(() => {
      if (activeClip.type === 'real') {
        const count = Number(activeClip.name)
        if (!isNaN(count)) {
          return count
        }
      }
      return 0
    }, [activeClip])

    React.useEffect(() => {
      if (barBeat === 1) {
        if (UIClipsOps.isReal(activeClip)) {
          const diff = Math.floor(beat - activeClip.startTime)
          if (timeSig.noteLength === 4) {
            setBarsSinceStart(Math.floor(diff / timeSig.noteCount))
          } else if (timeSig.noteLength === 8) {
            if (timeSig.noteCount % 2 === 0) {
              setBarsSinceStart(Math.floor(diff / (timeSig.noteCount / 2)))
            } else {
              if (diff % timeSig.noteCount === 0) {
                setBarsSinceStart(Math.floor(diff / timeSig.noteCount) * 2)
              } else {
                setBarsSinceStart(Math.floor(((diff + 0.5) * 2) / timeSig.noteCount))
              }
            }
          }
        }
      }
    }, [barBeat, beat, activeClip, timeSig])

    const barCount = (barsSinceStart % count) + 1

    const pads = targets.map((target, i) => (
      <Pad
        key={`bar-tracker-${i}`}
        color={i < barCount ? color : Color.BLACK}
        target={target}
      />
    ))

    return <>{pads}</>
  },
})
