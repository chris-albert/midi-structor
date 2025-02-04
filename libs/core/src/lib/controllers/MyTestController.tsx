import React from 'react'
import { Color } from './Color'
import { LaunchPadMiniMk3 } from './devices/LaunchpadMIniMk3'
import { MidiTarget } from '../midi/MidiTarget'
import { Midi } from '../midi/GlobalMidi'

export const MyController = () => {
  const emitter = Midi.useControllerEmitter()
  const listener = Midi.useControllerListener()
  const [pad1Color, setPad1Color] = React.useState(Color.RED)
  const [append, setAppend] = React.useState(false)

  React.useEffect(() => {
    const timer = setTimeout(() => {
      setPad1Color(Color.PURPLE)
    }, 5000)
    return () => clearTimeout(timer)
  }, [])

  return (
    <controller model={LaunchPadMiniMk3(emitter, listener)}>
      <pad
        color={pad1Color}
        target={MidiTarget.note(11)}
        onClick={() => {
          setPad1Color(Color.GREEN)
        }}
      />
      <pad
        color={Color.GREEN}
        target={MidiTarget.note(12)}
        onClick={() => console.log('Pad 2 clicked')}
      />
      <pad
        color={Color.BLUE}
        target={MidiTarget.note(13)}
      />
    </controller>
  )
}
