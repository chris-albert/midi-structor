import React from 'react'
import { MidiTarget } from '../../midi/MidiTarget'
import { Color } from '../Color'
import { Midi } from '../../midi/GlobalMidi'
import { TX_MESSAGE } from '../../project/AbletonUIMessage'
import { Pad } from '../pads/Pad'
import { ProjectHooks } from '../../project/ProjectHooks'

export type MetronomeControlWidgetProps = {
  target: MidiTarget
  color?: Color
}

export const MetronomeControlWidget: React.FC<MetronomeControlWidgetProps> = ({
  target,
  color = Color.YELLOW,
}) => {
  const dawEmitter = Midi.useDawEmitter()
  const metronomeState = ProjectHooks.useMetronomeState()

  return (
    <Pad
      isFlashing={metronomeState}
      color={color}
      target={target}
      onClick={() => dawEmitter.send(TX_MESSAGE.metronome(!ProjectHooks.getMetronomeState()))}
    />
  )
}
