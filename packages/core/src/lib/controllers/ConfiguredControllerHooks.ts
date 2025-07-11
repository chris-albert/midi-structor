import { Option, pipe } from 'effect'
import { State } from '../state/State'
import { EventEmitter, EventEmitterWithBroadcast } from '../EventEmitter'
import {
  MidiEventEmitterWithBroadcast,
  MidiEventRecord,
} from '../midi/MidiDevice'
import { ProjectHooks } from '../project/ProjectHooks'
import { ControllerDevices } from './devices/ControllerDevices'
import { Set } from 'immutable'
import React from 'react'
import { MidiMessage } from '../midi/MidiMessage'
import { ConfiguredController } from './ConfiguredController'
import { MidiListener } from '../midi/MidiListener'
import { MidiEmitter } from '../midi/MidiEmitter'
import { ProjectState } from '../state/ProjectState'
import _ from 'lodash'
import { log } from '../logger/log'
import { MidiDeviceSelection } from '../midi/MidiDeviceSelection'
import { MidiDeviceManager } from '../midi/MidiDeviceManager'

const useControllers = (): Readonly<Array<ConfiguredController>> => {
  const projectConfig = ProjectState.project.config.useValue()

  return React.useMemo(() => {
    const active = _.find(
      projectConfig.projects,
      (p) => p.key === projectConfig.active
    )
    if (active !== undefined) {
      return active.controllers
    } else {
      return []
    }
  }, [projectConfig])
}

const useSetControllers = () =>
  ProjectHooks.useActiveProjectState().useFocus('controllers').useSet()

const useProjectTracks = () => {
  const controllers = useControllers()

  const widgets = controllers.flatMap((controller) =>
    Option.match(ControllerDevices.findByName(controller.device), {
      onSome: (device) => device.widgets.resolve(controller.config),
      onNone: () => [],
    })
  )
  return Set(widgets.flatMap((widget) => widget.tracks())).toArray()
}

const useControllerStates = (): Array<State<ConfiguredController>> =>
  ProjectHooks.useActiveProjectState().useFocus('controllers').useArray()

const useAddController = () => {
  const setControllers = useSetControllers()

  return (name: string) => {
    setControllers((c) => [
      ...c,
      ConfiguredController.defaultConfiguredController(name),
    ])
  }
}

const useRemoveController = () => {
  const setControllers = useSetControllers()
  return (controller: ConfiguredController) => {
    setControllers((cs) => cs.filter((c) => c.id !== controller.id))
  }
}

const useControllerName = (controller: State<ConfiguredController>) => {
  return controller.useFocusMemo((o) => o.prop('name'))
}

const useController = (controller: State<ConfiguredController>) => {
  const controllerValue = controller.useValue()

  const [name, setName] = controller.useFocus('name').use()
  const [enabled, setEnabled] = controller.useFocus('enabled').use()
  const [config, setConfig] = controller.useFocus('config').use()
  const [device, setDevice] = controller.useFocus('device').use()
  const [color, setColor] = controller.useFocus('color').use()
  const removeController = useRemoveController()

  const remove = () => {
    removeController(controllerValue)
  }

  return {
    name,
    setName,
    enabled,
    setEnabled,
    config,
    setConfig,
    device,
    setDevice,
    color,
    setColor,
    remove,
    controller: controllerValue,
  }
}

const useRealController = (controller: State<ConfiguredController>) => {
  const baseController = useController(controller)
  const selected = controller.useFocus('selected')
  const [input, setInput] = selected.useFocus('input').use()
  const [output, setOutput] = selected.useFocus('output').use()

  return {
    ...baseController,
    input,
    setInput,
    output,
    setOutput,
  }
}

export type ControllerMidiDeviceSelections = {
  input: MidiDeviceSelection
  output: MidiDeviceSelection
}

const useMidiDeviceSelection = (
  controllerState: State<ConfiguredController>
): ControllerMidiDeviceSelections => {
  const controller = useRealController(controllerState)
  const manager = MidiDeviceManager.use()

  const input: MidiDeviceSelection = {
    type: 'input',
    devices: manager.inputs,
    setSelected: (n) => controller.setInput(Option.fromNullable(n)),
    selected: Option.getOrUndefined(controller.input),
  }

  const output: MidiDeviceSelection = {
    type: 'output',
    devices: manager.outputs,
    setSelected: (n) => controller.setOutput(Option.fromNullable(n)),
    selected: Option.getOrUndefined(controller.output),
  }

  return { input, output }
}

export type ConfiguredControllerIO = {
  emitter: MidiEmitter
  listener: MidiListener
}

const useRealIO = (
  controller: ConfiguredController
): ConfiguredControllerIO => {
  const manager = MidiDeviceManager.use()

  const listener = React.useMemo(
    () =>
      Option.getOrElse(
        pipe(controller.selected.input, Option.flatMap(manager.getInput)),
        () => MidiListener.empty()
      ),
    [controller]
  )

  const emitter = React.useMemo(
    () =>
      Option.getOrElse(
        pipe(controller.selected.output, Option.flatMap(manager.getOutput)),
        () => MidiEmitter.empty()
      ),
    [controller]
  )

  return {
    emitter,
    listener,
  }
}

const useVirtualListener = (
  controller: ConfiguredController
): MidiEventEmitterWithBroadcast =>
  React.useMemo(
    () => ConfiguredController.virtualListener(controller),
    [controller.id]
  )

const useVirtualEmitter = (
  controller: ConfiguredController
): MidiEventEmitterWithBroadcast =>
  React.useMemo(
    () => ConfiguredController.virtualEmitter(controller),
    [controller.id]
  )

const useVirtualIO = (
  controller: ConfiguredController
): ConfiguredControllerIO => {
  const emitter = MidiEmitter.fromEventEmitter(
    useVirtualEmitter(controller).emitter
  )
  const listener = useVirtualListener(controller).listener

  return {
    emitter,
    listener,
  }
}

const useIO = (
  controller: ConfiguredController,
  real: ConfiguredControllerIO
) => {
  const virtual = useVirtualIO(controller)

  const emitter: MidiEmitter = {
    send: (message: MidiMessage) => {
      real.emitter.send(message)
      virtual.emitter.send(message)
    },
  }
  const listener = EventEmitter<MidiEventRecord>()

  real.listener.on('*', listener.emit)

  React.useEffect(() => {
    virtual.listener.on('*', listener.emit)
  }, [])

  return {
    emitter,
    listener,
  }
}

const useListeners = (): MidiListener => {
  return MidiListener.empty()
}

export const ConfiguredControllerHooks = {
  useController,
  useControllers,
  useIO,
  useRealIO,
  useVirtualIO,
  useVirtualListener,
  useVirtualEmitter,
  useListeners,
  useRealController,
  useMidiDeviceSelection,
  useControllerName,
  useAddController,
  useControllerStates,
  useProjectTracks,
}
