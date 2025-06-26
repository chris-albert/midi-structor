import { Option, pipe, Schema } from 'effect'
import React from 'react'
import { MidiDevice, MidiEventRecord } from './MidiDevice'
import { MidiMessage } from './MidiMessage'
import { EventEmitter } from '../EventEmitter'
import { MidiDeviceManager } from './MidiDeviceManager'
import ProjectWorkerMain from '../workers/project/ProjectWorkerMain?worker'
import _ from 'lodash'
import { State } from '../state/State'

export const MidiDeviceType = Schema.Union(
  Schema.Literal('input'),
  Schema.Literal('output')
)
export type MidiDeviceType = typeof MidiDeviceType.Type

export type MidiDeviceSelection = {
  type: MidiDeviceType
  devices: Array<string>
  setSelected: (name: string | undefined) => void
  selected: string | undefined
}

export type MidiEventEmitter = EventEmitter<MidiMessage>

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

export const selectedAtom = (name: string): State<Option.Option<string>> =>
  State.storage<Option.Option<string>>(name, Option.none())

const states = {
  deviceManager: State.memSingle('device-manager', MidiDeviceManager.empty),
  devices: State.memSingle('devices', MidiDevice.empty),
  daw: {
    emitter: State.memSingle<MidiEmitter>('daw-emitter', emptyEmitter()),
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

const deviceManager = () => states.deviceManager.get()

const onSelectedInput = () => {
  const maybeListener = pipe(
    states.daw.selected.input.get(),
    Option.flatMap(deviceManager().getInput)
  )
  states.daw.listener.set(
    Option.getOrElse(maybeListener, () => MidiDeviceManager.emptyListener())
  )
}

const onSelectedOutput = () => {
  const maybeEmitter = pipe(
    states.daw.selected.output.get(),
    Option.flatMap(deviceManager().getOutput)
  )
  states.daw.emitter.set(
    Option.getOrElse(maybeEmitter, () => MidiDeviceManager.emptyEmitter())
  )
}

const getSelectedState = (
  deviceType: MidiDeviceType
): State<Option.Option<string>> =>
  deviceType === 'input'
    ? states.daw.selected.input
    : states.daw.selected.output

const selectionInit = () => {
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
  const manager = states.deviceManager.useValue()

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

const useMidiAllowed = () => {
  return states.deviceManager.useValue().isAllowed
}

const useDeviceManager = () => states.deviceManager.useValue()

const runInit = () => {
  selectionInit()
}

const PROJECT_WORKER_MAIN = new ProjectWorkerMain({ name: 'project' })
let isInit = false
const init = (manager: MidiDeviceManager) => {
  states.deviceManager.set(manager)
  if (!isInit) {
    // Set up DAW Listener
    states.daw.listener.sub((listener) =>
      listener.on('*', (m) =>
        PROJECT_WORKER_MAIN.postMessage(['DAW_LISTENER', m])
      )
    )
    // Set up DAW Emitter
    states.daw.emitter.sub((emitter) => {
      PROJECT_WORKER_MAIN.onmessage = (event) => {
        if (_.isArray(event.data) && event.data.length == 2) {
          if (event.data[0] === 'DAW_EMITTER') {
            emitter.send(event.data[1])
          }
        }
      }
    })
    isInit = true
  }
  runInit()
}

export const Midi = {
  init,
  useMidiDevices,
  useMidiAllowed,
  setSelected,
  getSelected,
  useDeviceManager,
  emptyListener,
  //Hooks
  useDawEmitter: () => states.daw.emitter.useValue(),
  useDawListener: () => states.daw.listener.useValue(),
}
