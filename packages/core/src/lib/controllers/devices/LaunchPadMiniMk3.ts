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
import { NovationColors } from '../NovationColors'
import { SoftRefreshWidget } from '../widgets/SoftRefreshWidget'

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

//Song 1
//Ableton sends: 16725558
//We convert to hex: FF3636
//The byte conversion: 255, 54, 54
//We send to controller: 255, 54, 54

//Song 2
//Albeton sends: 32192
//We convert to hex: 007DC0
//0, 125, 192

const controller = Controller.of({
  init: (emitter) => () => {
    emitter.send(MidiMessage.sysex([32, 41, 2, 13, 14, 1]))
  },
  render: (emitter) => (pads) => {
    const sysexArr = [32, 41, 2, 13, 3]
    _.forEach(pads, (pad) => {
      if (pad.color !== undefined) {
        const novationColor = NovationColors.getNovationColor(pad.color)
        if (novationColor !== undefined) {
          sysexArr.push(0, MidiTarget.toValue(pad.target), novationColor)
        } else {
          const [r, g, b] = Color.toRGB(fixColor(pad.color, false))
          sysexArr.push(
            3,
            MidiTarget.toValue(pad.target),
            Math.floor(r / 2),
            Math.floor(g / 2),
            Math.floor(b / 2)
          )
        }
      }
    })
    emitter.send(MidiMessage.sysex(sysexArr))
  },
  loading: (emitter) => (controller) => {
    const targets = MidiTarget.notes({ from: 11, to: 99 })
    const color = (num: number, value: number): Color => {
      const firstDigit = Math.floor(value / 10)
      const secondDigit = value % 10
      if (firstDigit <= num + 1 && secondDigit <= num + 1) {
        return (
          Color.ROYGBIV[(Math.max(firstDigit, secondDigit) - 1) % 7] ||
          Color.WHITE
        )
      } else {
        return Color.BLACK
      }
    }
    let count = 0
    const id = setInterval(() => {
      const num = count % 9
      controller.render(emitter)(
        targets.map((target, index) => ({
          target,
          color: color(num, MidiTarget.toValue(target)),
        }))
      )
      count++
    }, 250)
    return () => {
      clearInterval(id)
    }
  },
  listenFilter: (m: MidiMessage): boolean => {
    return !(
      (m.type === 'noteon' && m.velocity === 0) ||
      (m.type === 'cc' && m.data === 0)
    )
  },
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
    SoftRefreshWidget,
  ]),
})

export const LaunchPadMiniMk3 = {
  device,
}
