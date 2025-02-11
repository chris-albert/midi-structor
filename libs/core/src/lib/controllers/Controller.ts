import { Data } from 'effect'
import _ from 'lodash'
import { Color } from './Color'
import { MidiTarget } from '../midi/MidiTarget'
import { MidiMessage } from '../midi/MidiMessage'
import { Midi, MidiListener } from '../midi/GlobalMidi'

export const messageToKey = (message: MidiMessage): string => {
  if (message.type === 'noteon' && message.velocity > 0) {
    return `noteon-${message.note}`
  } else if (message.type === 'cc') {
    return `cc-${message.controllerNumber}`
  } else {
    return ''
  }
}

export type TargetColor = {
  target: MidiTarget
  color: number
}

export class Controller extends Data.Class<{
  targets: Array<MidiTarget>
  init: () => void
  render: (pads: Array<TargetColor>) => void
  listener: MidiListener
}> {
  cleanup: (() => void) | undefined = undefined

  clear() {
    this.render(
      _.map(this.targets, (target) => ({
        target,
        color: Color.BLACK,
      })),
    )
  }

  on(f: (m: MidiMessage) => void): void {
    this.cleanup = this.listener.on('*', f)
  }

  off() {
    if (this.cleanup !== undefined) {
      this.cleanup()
    }
  }
}

export const emptyController: Controller = new Controller({
  targets: [],
  init: () => {},
  render: () => {},
  listener: Midi.emptyListener(),
})
