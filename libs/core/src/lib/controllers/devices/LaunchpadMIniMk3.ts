import { MidiEmitter, MidiListener } from '../../midi/GlobalMidi'
import { SysExMessage } from '../../midi/MidiMessage'
import _ from 'lodash'
import { Controller } from '../Controller'
import { Color } from '../Color'
import { MidiTarget } from '../../midi/MidiTarget'

const sysex = (body: Array<number>): SysExMessage => ({
  type: 'sysex',
  manufacturer: 0,
  statusByte: 32,
  body,
})

export const LaunchPadMiniMk3 = (emitter: MidiEmitter, listener: MidiListener) =>
  new Controller({
    init: () => {
      emitter.send(sysex([41, 2, 13, 14, 1]))
    },
    render: (pads) => {
      const sysexArr = [41, 2, 13, 3]
      _.forEach(pads, (pad) => {
        if (pad.color !== undefined) {
          const [r, g, b] = Color.toRGB(pad.color)
          sysexArr.push(3, MidiTarget.toValue(pad.target), r / 2, g / 2, b / 2)
        }
      })
      emitter.send(sysex(sysexArr))
    },
    on: (f) => {
      listener.on('*', f)
    },
    pads: [],
  })
