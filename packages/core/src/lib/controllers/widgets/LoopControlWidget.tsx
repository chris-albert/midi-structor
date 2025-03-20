import React from 'react'
import { MidiTarget } from '../../midi/MidiTarget'
import { Color } from '../Color'
import { Midi } from '../../midi/GlobalMidi'
import { ProjectHooks } from '../../project/ProjectHooks'
import { Pad } from '../pads/Pad'
import { TX_MESSAGE } from '../../project/AbletonUIMessage'

export type LoopControlWidgetProps = {
  target: MidiTarget
  color?: Color
}

export const LoopControlWidget: React.FC<LoopControlWidgetProps> = ({ target, color = Color.YELLOW }) => {
  const dawEmitter = Midi.useDawEmitter()
  const loopState = ProjectHooks.useLoopState()

  return (
    <Pad
      isFlashing={loopState}
      color={color}
      target={target}
      onClick={() => dawEmitter.send(TX_MESSAGE.loop(!ProjectHooks.getLoopState()))}
    />
  )
}
