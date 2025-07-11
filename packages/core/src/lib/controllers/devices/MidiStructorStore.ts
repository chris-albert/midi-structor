import { UIMessageStore, UIStore } from './ui/UIStore'
import { MidiMessage, SysExMessage } from '../../midi/MidiMessage'
import { MidiTarget } from '../../midi/MidiTarget'
import { Either } from 'effect'
import { MIDIStructorMessage } from './MidiStructorMessage'
import { MidiStructorMidi } from './MidiStructorMidi'

export type MIDIStructorStore = UIMessageStore<MIDIStructorMessage>

const parseMessage = (sysex: SysExMessage): any => {
  return Either.match(
    MidiMessage.parseJsonSysex(sysex, MIDIStructorMessage, 1),
    {
      onRight: (m) => {
        if (m._tag === 'init') {
          return { init: m }
        } else if (m._tag === 'pad') {
          return { [MidiTarget.toKey(m.target)]: m }
        } else {
          return {}
        }
      },
      onLeft: (parseError) => {
        console.error('Error parsing MIDIStructor UI widgets', parseError)
        return {}
      },
    }
  )
}

const MidiStructorMessageStore = UIStore.state<MIDIStructorMessage>()

const uiStore: UIStore<MIDIStructorMessage> = (name) => {
  const store = MidiStructorMessageStore(name)
  const setStore = store.set
  return {
    put: () => (m: MidiMessage) => {
      if (m.type === 'sysex') {
        if (m.body[0] === MidiStructorMidi.sysexControlCode) {
          setStore((s) => ({ ...s, ...parseMessage(m) }))
        }
      }
    },
    useGet: () => store.useValue(),
  }
}

export const MidiStructorStore = {
  uiStore,
}
