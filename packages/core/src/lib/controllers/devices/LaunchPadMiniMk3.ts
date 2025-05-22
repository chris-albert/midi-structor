import { MidiEmitter, MidiListener } from '../../midi/GlobalMidi'
import { MidiMessage } from '../../midi/MidiMessage'
import _ from 'lodash'
import { Controller } from '../Controller'
import { Color } from '../Color'
import { MidiTarget } from '../../midi/MidiTarget'
import { ControllerDevice } from './ControllerDevice'
import { ControllerWidgets } from '../ControllerWidgets'
import { PlayWidget } from '../widgets/PlayWidget'
import { StopWidget } from '../widgets/StopWidget'
import { RecordWidget } from '../widgets/RecordWidget'
import { MetronomeControlWidget } from '../widgets/MetronomeControlWidget'
import { LoopControlWidget } from '../widgets/LoopControlWidget'
import { PlayStopWidget } from '../widgets/PlayStopWidget'
import { MetronomeWidget } from '../widgets/MetronomeWidget'
import { BeatsWidget } from '../widgets/BeatsWidget'
import { TimeSigNoteCountWidget } from '../widgets/TimeSigNoteCountWidget'
import { TimeSigNoteLengthWidget } from '../widgets/TimeSigNoteLengthWidget'
import { NavClipsWidget } from '../widgets/NavClipsWidget'
import { BarTrackerWidget } from '../widgets/BarTrackerWidget'
import { TrackSectionsWidget } from '../widgets/TrackSectionsWidget'
import { KeyBoardWidget } from '../widgets/KeyBoardWidget'
import { ButtonWidget } from '../widgets/ButtonWidget'

const COLOR_SCALE = 0.5

const fixColor = (color: Color, fixColor: boolean): Color => {
  if (fixColor) {
    //find max channel
    const [r, g, b] = Color.toRGB(color)
    if (r > g && r > b) {
      return Color.fromRGB(
        r,
        Math.floor(g * COLOR_SCALE),
        Math.floor(b * COLOR_SCALE)
      )
    } else if (g > r && g > b) {
      return Color.fromRGB(
        Math.floor(r * COLOR_SCALE),
        g,
        Math.floor(b * COLOR_SCALE)
      )
    } else if (b > r && b > g) {
      return Color.fromRGB(
        Math.floor(r * COLOR_SCALE),
        Math.floor(g * COLOR_SCALE),
        b
      )
    } else {
      return color
    }
  } else {
    return color
  }
}

const controller = (
  emitter: MidiEmitter,
  listener: MidiListener,
  virtual: boolean
) =>
  new Controller({
    init: () => {
      emitter.send(MidiMessage.sysex([32, 41, 2, 13, 14, 1]))
    },
    render: (pads) => {
      const sysexArr = [32, 41, 2, 13, 3]
      _.forEach(pads, (pad) => {
        if (pad.color !== undefined) {
          const [r, g, b] = Color.toRGB(fixColor(pad.color, !virtual))
          sysexArr.push(
            3,
            MidiTarget.toValue(pad.target),
            Math.floor(r / 2),
            Math.floor(g / 2),
            Math.floor(b / 2)
          )
        }
      })
      emitter.send(MidiMessage.sysex(sysexArr))
    },
    loading: (controller) => {
      const allWhite = () => {
        controller.render(
          _.map(controller.targets, (target) => ({
            target,
            color: Color.WHITE,
          }))
        )
      }
      const allBlack = () => {
        controller.render(
          _.map(controller.targets, (target) => ({
            target,
            color: Color.BLACK,
          }))
        )
      }
      let flip = false

      const id = setInterval(() => {
        const _ = flip ? allWhite() : allBlack()
        flip = !flip
      }, 200)
      console.log('loading', id)
      return () => {
        console.log('cleanup', id)
        clearInterval(id)
      }
    },
    listenFilter: (m: MidiMessage): boolean => {
      return !(
        (m.type === 'noteon' && m.velocity === 0) ||
        (m.type === 'cc' && m.data === 0)
      )
    },
    listener,
    targets: MidiTarget.notes({ from: 11, to: 99 }),
  })

const device = ControllerDevice.of({
  name: 'Launchpad Mini [MK3]',
  controller,
  widgets: ControllerWidgets([
    PlayWidget,
    StopWidget,
    RecordWidget,
    MetronomeControlWidget,
    LoopControlWidget,
    PlayStopWidget,
    MetronomeWidget,
    BeatsWidget,
    TimeSigNoteCountWidget,
    TimeSigNoteLengthWidget,
    NavClipsWidget,
    BarTrackerWidget,
    TrackSectionsWidget,
    KeyBoardWidget,
    ButtonWidget,
  ]),
})

export const LaunchPadMiniMk3 = {
  device,
}
