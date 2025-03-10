import { atom, getDefaultStore, PrimitiveAtom, useAtomValue } from 'jotai'
import { Option, pipe, Schema } from 'effect'
import React from 'react'
import { useAtom } from 'jotai/index'
import { MidiDevice, MidiDevices, MidiEventRecord } from './MidiDevice'
import { MidiMessage } from './MidiMessage'
import { EventEmitter } from '../EventEmitter'
import { MidiDeviceManager } from './MidiDeviceManager'
import { AtomStorage } from '../storage/AtomStorage'

export const MidiType = Schema.Union(
  Schema.Literal('daw'),
  Schema.Literal('controller'),
  Schema.Literal('agent')
)
export type MidiType = typeof MidiType.Type

export const MidiDeviceType = Schema.Union(Schema.Literal('input'), Schema.Literal('output'))
export type MidiDeviceType = typeof MidiDeviceType.Type

export type MidiSelection = {
  emitter: PrimitiveAtom<MidiEmitter>
  listener: PrimitiveAtom<MidiListener>
  selected: {
    input: PrimitiveAtom<Option.Option<string>>
    output: PrimitiveAtom<Option.Option<string>>
  }
}

export type MidiDeviceSelection = {
  type: MidiDeviceType
  devices: Array<string>
  setSelected: (name: string | undefined) => void
  selected: string | undefined
}

const store = getDefaultStore()

export type MidiListener = Omit<EventEmitter<MidiEventRecord>, 'emit'>

const emptyListener = (): MidiListener => ({
  on: () => () => {},
})

export type MidiEmitter = {
  send: (m: MidiMessage) => void
}

const emptyEmitter = (): MidiEmitter => ({
  send: (message: MidiMessage) => {
    console.debug('Empty send', message)
  },
})

export const selectedAtom = (name: string): PrimitiveAtom<Option.Option<string>> =>
  AtomStorage.atom<Option.Option<string>>(name, Option.none())

const atoms = {
  deviceManager: atom<MidiDeviceManager>(MidiDeviceManager.empty),
  devices: atom<MidiDevices>(MidiDevice.empty),
  daw: {
    emitter: atom<MidiEmitter>(emptyEmitter()),
    listener: atom<MidiListener>(EventEmitter<MidiEventRecord>()),
    selected: {
      input: selectedAtom('daw-midi-input-selected'),
      output: selectedAtom('daw-midi-output-selected'),
    },
  },
  agent: {
    emitter: atom<MidiEmitter>(emptyEmitter()),
    listener: atom<MidiListener>(EventEmitter<MidiEventRecord>()),
    selected: {
      input: selectedAtom('agent-midi-input-selected'),
      output: selectedAtom('agent-midi-output-selected'),
    },
  },
}

const deviceManager = () => store.get(atoms.deviceManager)

const onSelectedInput = (selection: MidiSelection) => {
  const maybeListener = pipe(store.get(selection.selected.input), Option.flatMap(deviceManager().getInput))
  store.set(
    selection.listener,
    Option.getOrElse(maybeListener, () => MidiDeviceManager.emptyListener())
  )
}

const onSelectedOutput = (selection: MidiSelection) => {
  const maybeEmitter = pipe(store.get(selection.selected.output), Option.flatMap(deviceManager().getOutput))
  store.set(
    selection.emitter,
    Option.getOrElse(maybeEmitter, () => MidiDeviceManager.emptyEmitter())
  )
}

const getByType = (type: MidiType): MidiSelection => (type === 'daw' ? atoms.daw : atoms.agent)

const getSelectedAtom = (type: MidiType, deviceType: MidiDeviceType): PrimitiveAtom<Option.Option<string>> =>
  deviceType === 'input' ? getByType(type).selected.input : getByType(type).selected.output

const selectionInit = (midiType: MidiType) => {
  const selection = getByType(midiType)

  store.sub(selection.selected.input, () => onSelectedInput(selection))
  onSelectedInput(selection)

  store.sub(selection.selected.output, () => onSelectedOutput(selection))
  onSelectedOutput(selection)
}

const setSelected = (name: Option.Option<string>, midiType: MidiType, deviceType: MidiDeviceType) => {
  const selected = getSelectedAtom(midiType, deviceType)
  store.set(selected, name)
}

const getSelected = (midiType: MidiType, deviceType: MidiDeviceType) =>
  store.get(getSelectedAtom(midiType, deviceType))

const useMidiDevices = (midiType: MidiType, deviceType: MidiDeviceType): MidiDeviceSelection => {
  const manager = useAtomValue(atoms.deviceManager)

  const devices = React.useMemo(() => (deviceType === 'input' ? manager.inputs : manager.outputs), [manager])

  const [selected, setSelected] = useAtom(getSelectedAtom(midiType, deviceType))

  return {
    type: deviceType,
    devices,
    selected: Option.getOrUndefined(selected),
    setSelected: (s: string | undefined) => {
      setSelected(Option.fromNullable(s))
    },
  }
}

const useMidiAllowed = () => {
  return useAtomValue(atoms.deviceManager).isAllowed
}

const useDeviceManager = () => useAtomValue(atoms.deviceManager)

const runInit = () => {
  selectionInit('daw')
  selectionInit('controller')
  selectionInit('agent')
}

const init = (manager: MidiDeviceManager) => {
  store.set(atoms.deviceManager, manager)
  runInit()
}

export const Midi = {
  init,
  useMidiDevices,
  useMidiAllowed,
  setSelected,
  getSelected,
  useDeviceManager,
  //Hooks
  useDawEmitter: () => useAtomValue(atoms.daw.emitter),
  useDawListener: () => useAtomValue(atoms.daw.listener),
  useAgentListener: () => useAtomValue(atoms.agent.listener),
  useAgentEmitter: () => useAtomValue(atoms.agent.emitter),
  //Temporary exports
  dawListener: store.get(atoms.daw.listener),
  dawListenerAtom: atoms.daw.listener,

  emptyListener,
}
