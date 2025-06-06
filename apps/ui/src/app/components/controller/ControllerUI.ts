import { MidiMessage, MidiTarget } from '@midi-structor/core'
import { Data, Option } from 'effect'
import React from 'react'
import _ from 'lodash'

export class ControllerPad extends Data.Class<{
  target: MidiTarget
  content: React.ReactElement
}> {
  message(value: number): MidiMessage {
    return MidiTarget.toMessage(this.target, value)
  }
}

export class ControllerUI extends Data.Class<{
  pads: Array<Array<ControllerPad>>
}> {
  private noteLookup: Record<number, ControllerPad> = _.fromPairs(
    _.compact(
      _.flatMap(this.pads, (r) =>
        _.map(r, (p) =>
          MidiTarget.match({
            Note: ({ note }) => [note, p],
            CC: () => undefined,
            PC: () => undefined,
          })(p.target)
        )
      )
    )
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
}

export const midiFromRowCol = (row: number, column: number): number => parseInt(`${row}${column + 1}`)
