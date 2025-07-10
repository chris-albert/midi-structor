import { Option, pipe } from 'effect'
import { State } from '../state/State'
import { MidiEmitter } from './MidiEmitter'
import { MidiListener } from './MidiListener'
import { EventEmitter } from '../EventEmitter'
import { MidiEventRecord } from './MidiDevice'
import { MidiDeviceSelection, MidiDeviceType } from './MidiDeviceSelection'
import React from 'react'
import { MidiDeviceManager } from './MidiDeviceManager'

export const selectedAtom = (name: string): State<Option.Option<string>> =>
  State.storage<Option.Option<string>>(name, Option.none())

const states = {
  daw: {
    emitter: State.memSingle<MidiEmitter>('daw-emitter', MidiEmitter.empty()),
    listener: State.memSingle<MidiListener>(
      'daw-listener',
      EventEmitter<MidiEventRecord>()
    ),
    selected: {
      input: selectedAtom('daw-midi-input-selected'),
      output: selectedAtom('daw-midi-output-selected'),
    },
  },
}

const deviceManager = () => MidiDeviceManager.state.get()

const onSelectedInput = () => {
  const maybeListener = pipe(
    states.daw.selected.input.get(),
    Option.flatMap(deviceManager().getInput)
  )
  states.daw.listener.set(
    Option.getOrElse(maybeListener, () => MidiListener.empty())
  )
}

const onSelectedOutput = () => {
  const maybeEmitter = pipe(
    states.daw.selected.output.get(),
    Option.flatMap(deviceManager().getOutput)
  )
  states.daw.emitter.set(
    Option.getOrElse(maybeEmitter, () => MidiEmitter.empty())
  )
}

const getSelectedState = (
  deviceType: MidiDeviceType
): State<Option.Option<string>> =>
  deviceType === 'input'
    ? states.daw.selected.input
    : states.daw.selected.output

const init = () => {
  states.daw.selected.input.sub(onSelectedInput)
  onSelectedInput()

  states.daw.selected.output.sub(onSelectedOutput)
  onSelectedOutput()
}

const setSelected = (
  name: Option.Option<string>,
  deviceType: MidiDeviceType
) => {
  getSelectedState(deviceType).set(name)
}

const getSelected = (deviceType: MidiDeviceType) =>
  getSelectedState(deviceType).get()

const useMidiDevices = (deviceType: MidiDeviceType): MidiDeviceSelection => {
  const manager = MidiDeviceManager.state.useValue()

  const devices = React.useMemo(
    () => (deviceType === 'input' ? manager.inputs : manager.outputs),
    [manager]
  )

  const selected = getSelectedState(deviceType).useValue()
  const setSelected = getSelectedState(deviceType).useSet()

  return {
    type: deviceType,
    devices,
    selected: Option.getOrUndefined(selected),
    setSelected: (s: string | undefined) => {
      setSelected(Option.fromNullable(s))
    },
  }
}

let BROADCAST: BroadcastChannel | undefined = undefined
const getChannel = (): BroadcastChannel => {
  if (BROADCAST === undefined) {
    BROADCAST = new BroadcastChannel('project:daw')
  }
  return BROADCAST
}

const useDawEmitter = (): MidiEmitter => {
  const channel = getChannel()
  return {
    send: (message) => {
      channel.postMessage(message)
    },
  }
}

export const DawMidi = {
  init,
  useMidiDevices,
  setSelected,
  getSelected,
  states,
  getChannel,
  useDawEmitter,
  useDawListener: () => states.daw.listener.useValue(),
}
