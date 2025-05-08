import { MidiEmitter, MidiListener } from '../../midi/GlobalMidi'
import { Controller } from '../Controller'
import { ControllerDevice } from './ControllerDevice'
import { MidiMessage, SysExMessage } from '../../midi/MidiMessage'
import { ControllerWidgets } from '../ControllerWidgets'
import { Either, Schema } from 'effect'
import { ControllerWidgetsType } from '../ControllerWidget'
import { MidiTarget } from '../../midi/MidiTarget'
import { Color } from '../Color'
import { UIMessageStore, UIStore } from './ui/ControllerUIDevice'
import { atomFamily } from 'jotai/utils'
import { atom, useAtomValue, useSetAtom } from 'jotai'
import { AllMidiStructorWidgets } from './midistructor/widgets/AllMidiStructorWidgets'

const widgets = ControllerWidgets(AllMidiStructorWidgets.controllerWidgets)

type ElementType<T> = T extends (infer U)[] ? U : never

export type MIDIStructorUIWidgets = ControllerWidgetsType<
  typeof widgets.widgets
>

export type MIDIStructorUIWidgetsUpdate = (
  wu: (w: MIDIStructorUIWidgets) => MIDIStructorUIWidgets
) => void

export type MIDIStructorUIWidget = ElementType<MIDIStructorUIWidgets>

export const MidiStructorUIInit = Schema.TaggedStruct('init', {
  widgets: Schema.Array(widgets.schema),
})

export const MIDIStructorPad = Schema.TaggedStruct('pad', {
  target: MidiTarget.Schema,
  color: Color.Schema,
  options: Schema.optional(Schema.Any),
})

export type MIDIStructorPad = typeof MIDIStructorPad.Type

export const MIDIStructorMessage = Schema.Union(
  MidiStructorUIInit,
  MIDIStructorPad
)
export type MIDIStructorMessage = typeof MIDIStructorMessage.Type

export const MIDIStructorResend = Schema.TaggedStruct('resend', {})

export const MidiStructorSysexControlCode = 50
export const MidiStructorUIManufacturer = 0x03

const controller = (
  emitter: MidiEmitter,
  listener: MidiListener,
  virtual: boolean
) =>
  new Controller({
    init: (widgets) => {
      const uiWidgets = MidiStructorUIInit.make({
        widgets: widgets.map((w) => w.widget),
      })
      console.log('MidiStructor UI widgets', uiWidgets)
      emitter.send(
        MidiMessage.jsonSchemaSysex(
          uiWidgets,
          MidiStructorUIInit,
          [MidiStructorSysexControlCode],
          MidiStructorUIManufacturer
        )
      )
    },
    render: (pads) => {
      pads.forEach((pad) => {
        emitter.send(
          MidiMessage.jsonSchemaSysex(
            MIDIStructorPad.make({
              target: pad.target,
              color: pad.color,
              options: pad.options,
            }),
            MIDIStructorPad,
            [MidiStructorSysexControlCode]
          )
        )
      })
    },
    listenFilter: (m: MidiMessage): boolean => true,
    listener,
    targets: [],
  })

export type MIDIStructorStore = UIMessageStore<MIDIStructorMessage>

const atomStore = atomFamily((name: string) => atom<MIDIStructorStore>({}))

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

const useStore: UIStore<MIDIStructorMessage> = (name) => {
  const setStore = useSetAtom(atomStore(name))
  return {
    usePut: () => (m: MidiMessage) => {
      if (m.type === 'sysex') {
        if (m.body[0] === MidiStructorSysexControlCode) {
          setStore((s) => ({ ...s, ...parseMessage(m) }))
        }
      }
    },
    useGet: () => useAtomValue(atomStore(name)),
  }
}

const device = ControllerDevice.of({
  name: 'MIDI Structor UI',
  controller,
  widgets,
})

export type MidiStructorUIDevice = typeof device

export const MIDIStructorUI = {
  device,
  useStore,
}
