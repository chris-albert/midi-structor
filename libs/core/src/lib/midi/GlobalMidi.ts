import { atom, getDefaultStore, PrimitiveAtom, useAtomValue } from 'jotai'
import { atomWithStorage } from 'jotai/utils'
import { Option, pipe } from 'effect'
import React from 'react'
import { useAtom } from 'jotai/index'
import { MidiDevice, MidiDevices, MidiEventRecord } from './MidiDevice'
import { MidiMessage } from './MidiMessage'
import { ControllerMidi } from '../controllers/ControllerMidi'
import { EventEmitter } from '../EventEmitter'
import { MidiDeviceManager } from './MidiDeviceManager'

export type MidiType = 'daw' | 'controller' | 'agent'
export type MidiDeviceType = 'input' | 'output'

export type MidiIOAtom<I, O> = {
  input: PrimitiveAtom<Option.Option<I>>
  output: PrimitiveAtom<Option.Option<O>>
}

export type MidiSelection = {
  emitter: PrimitiveAtom<MidiEmitter>
  listener: PrimitiveAtom<MidiListener>
  selected: MidiIOAtom<string, string>
}

export type MidiDeviceSelection = {
  type: MidiDeviceType
  devices: Array<string>
  setSelected: (name: string | undefined) => void
  selected: string | undefined
}

const store = getDefaultStore()

export type MidiListener = Omit<EventEmitter<MidiEventRecord>, 'emit'>

export type MidiEmitter = {
  send: (m: MidiMessage) => void
}

const emptyEmitter = (): MidiEmitter => ({
  send: (message: MidiMessage) => {
    console.debug('Empty send', message)
  },
})

const atoms = {
  deviceManager: atom<MidiDeviceManager>(MidiDeviceManager.empty),
  devices: atom<MidiDevices>(MidiDevice.empty),
  daw: {
    emitter: atom<MidiEmitter>(emptyEmitter()),
    listener: atom<MidiListener>(EventEmitter<MidiEventRecord>()),
    selected: {
      input: atomWithStorage<Option.Option<string>>('daw-midi-input-selected', Option.none()),
      output: atomWithStorage<Option.Option<string>>('daw-midi-output-selected', Option.none()),
    },
  },
  controller: {
    emitter: atom<MidiEmitter>(emptyEmitter()),
    listener: atom<MidiListener>(EventEmitter<MidiEventRecord>()),
    selected: {
      input: atomWithStorage<Option.Option<string>>('controller-midi-input-selected', Option.none()),
      output: atomWithStorage<Option.Option<string>>('controller-midi-output-selected', Option.none()),
    },
  },
  agent: {
    emitter: atom<MidiEmitter>(emptyEmitter()),
    listener: atom<MidiListener>(EventEmitter<MidiEventRecord>()),
    selected: {
      input: atomWithStorage<Option.Option<string>>('agent-midi-input-selected', Option.none()),
      output: atomWithStorage<Option.Option<string>>('agent-midi-output-selected', Option.none()),
    },
  },
}

const deviceManager = () => store.get(atoms.deviceManager)

const onSelectedInput = (selection: MidiSelection) => {
  const maybeListener = pipe(store.get(selection.selected.input), Option.flatMap(deviceManager().getInput))
  store.set(
    selection.listener,
    Option.getOrElse(maybeListener, () => MidiDeviceManager.emptyListener()),
  )
}

const onSelectedOutput = (selection: MidiSelection) => {
  const maybeEmitter = pipe(store.get(selection.selected.output), Option.flatMap(deviceManager().getOutput))
  store.set(
    selection.emitter,
    Option.getOrElse(maybeEmitter, () => MidiDeviceManager.emptyEmitter()),
  )
}

const getByType = (type: MidiType): MidiSelection =>
  type === 'daw' ? atoms.daw : type === 'controller' ? atoms.controller : atoms.agent

const getSelected = (type: MidiType, deviceType: MidiDeviceType): PrimitiveAtom<Option.Option<string>> =>
  deviceType === 'input' ? getByType(type).selected.input : getByType(type).selected.output

const selectionInit = (midiType: MidiType) => {
  const selection = getByType(midiType)

  store.sub(selection.selected.input, () => onSelectedInput(selection))
  onSelectedInput(selection)

  store.sub(selection.selected.output, () => onSelectedOutput(selection))
  onSelectedOutput(selection)
}

const useMidiDevices = (midiType: MidiType, deviceType: MidiDeviceType): MidiDeviceSelection => {
  const manager = useAtomValue(atoms.deviceManager)

  const devices = React.useMemo(() => (deviceType === 'input' ? manager.inputs : manager.outputs), [manager])

  const [selected, setSelected] = useAtom(getSelected(midiType, deviceType))

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

const runInit = () => {
  selectionInit('daw')
  selectionInit('controller')
  selectionInit('agent')
  // ControllerMidi.init()
}

const init = (manager: MidiDeviceManager) => {
  store.set(atoms.deviceManager, manager)
  runInit()
}

export const Midi = {
  init,
  useMidiDevices,
  useMidiAllowed,
  //Hooks
  useDawEmitter: () => useAtomValue(atoms.daw.emitter),
  useControllerEmitter: () => useAtomValue(atoms.controller.emitter),
  useDawListener: () => useAtomValue(atoms.daw.listener),
  useControllerListener: () => useAtomValue(atoms.controller.listener),
  useAgentListener: () => useAtomValue(atoms.agent.listener),
  useAgentEmitter: () => useAtomValue(atoms.agent.emitter),
  //Temporary exports
  dawListener: store.get(atoms.daw.listener),
  dawListenerAtom: atoms.daw.listener,
}
