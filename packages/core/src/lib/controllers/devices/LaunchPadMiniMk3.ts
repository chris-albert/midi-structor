import { MidiEmitter, MidiListener } from '../../midi/GlobalMidi'
import { MidiMessage, SysExMessage } from '../../midi/MidiMessage'
import _ from 'lodash'
import { Controller } from '../Controller'
import { Color } from '../Color'
import { MidiTarget } from '../../midi/MidiTarget'
import { ControllerDevice } from './ControllerDevice'

const sysex = (body: Array<number>): SysExMessage => ({
  type: 'sysex',
  manufacturer: 0,
  body,
})

const COLOR_SCALE = 0.5
const COLOR_FIX = false

const fixColor = (color: Color, fixColor: boolean): Color => {
  if (fixColor) {
    //find max channel
    const [r, g, b] = Color.toRGB(color)
    if (r > g && r > b) {
      return Color.fromRGB(r, Math.floor(g * COLOR_SCALE), Math.floor(b * COLOR_SCALE))
    } else if (g > r && g > b) {
      return Color.fromRGB(Math.floor(r * COLOR_SCALE), g, Math.floor(b * COLOR_SCALE))
    } else if (b > r && b > g) {
      return Color.fromRGB(Math.floor(r * COLOR_SCALE), Math.floor(g * COLOR_SCALE), b)
    } else {
      return color
    }
  } else {
    return color
  }
}

const controller = (emitter: MidiEmitter, listener: MidiListener, virtual: boolean) =>
  new Controller({
    init: () => {
      emitter.send(sysex([32, 41, 2, 13, 14, 1]))
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
      emitter.send(sysex(sysexArr))
    },
    listenFilter: (m: MidiMessage): boolean => {
      return !((m.type === 'noteon' && m.velocity === 0) || (m.type === 'cc' && m.data === 0))
    },
    listener,
    targets: MidiTarget.notes({ from: 11, to: 99 }),
  })

export const LaunchPadMiniMk3 = ControllerDevice.of({
  name: 'Launchpad Mini [MK3]',
  controller,
})
