import React from 'react'
import { Data, Option } from 'effect'
import _ from 'lodash'
import { Color } from './Color'
import { MidiTarget } from '../midi/MidiTarget'
import { MidiMessage } from '../midi/MidiMessage'

export const messageToKey = (message: MidiMessage): string => {
  if (message.type === 'noteon' && message.velocity > 0) {
    return `noteon-${message.note}`
  } else if (message.type === 'cc') {
    return `cc-${message.controllerNumber}`
  } else {
    return ''
  }
}

export type ControllerPadColor = {
  target: MidiTarget
  color: number | undefined
}

export class ControllerPad extends Data.Class<{
  target: MidiTarget
  content: React.ReactElement
}> {
  message(value: number): MidiMessage {
    return MidiTarget.toMessage(this.target, value)
  }
}

/**
 * The `pads` are laid out from top left to bottom right
 */
export class Controller extends Data.Class<{
  pads: Array<Array<ControllerPad>>
  init: () => void
  render: (pads: Array<ControllerPadColor>) => void
  on: (f: (m: MidiMessage) => void) => void
}> {
  private noteLookup: Record<number, ControllerPad> = _.fromPairs(
    _.compact(
      _.flatMap(this.pads, (r) =>
        _.map(r, (p) =>
          MidiTarget.match({
            Note: ({ note }) => [note, p],
            CC: () => undefined,
            PC: () => undefined,
          })(p.target),
        ),
      ),
    ),
  )

  foreach(f: (pad: ControllerPad) => void): void {
    this.pads.forEach((row) => row.forEach(f))
  }

  find(midi: MidiMessage): Option.Option<ControllerPad> {
    if (midi.type === 'noteon') {
      const res = _.get(this.noteLookup, midi.note)
      if (res !== undefined && midi.velocity > 0) {
        return Option.some(res)
      }
    }
    return Option.none()
  }

  clear() {
    this.render(
      _.flatMap(this.pads, (padRow) =>
        _.map(padRow, (pad) => ({
          target: pad.target,
          color: Color.BLACK,
        })),
      ),
    )
  }
}

export const emptyController: Controller = new Controller({
  pads: [],
  init: () => {},
  render: () => {},
  on: () => {},
})

export const midiFromRowCol = (row: number, column: number): number => parseInt(`${row}${column + 1}`)
