import { useAtomValue, useAtom, PrimitiveAtom } from 'jotai'
import { Option, pipe } from 'effect'
import React from 'react'
import { OpticFor_ } from 'optics-ts'
import { Set } from 'immutable'
import {
  Midi,
  MidiDeviceSelection,
  MidiEmitter,
  MidiListener,
} from '../midi/GlobalMidi'
import { MidiDeviceManager } from '../midi/MidiDeviceManager'
import { MidiMessage } from '../midi/MidiMessage'
import { EventEmitter } from '../EventEmitter'
import { MidiEventRecord } from '../midi/MidiDevice'
import { Color } from './Color'
import { ControllerConfig } from './ControllerConfig'
import { ControllerDevices } from './devices/ControllerDevices'
import { ControllerUIDevices } from './devices/ui/ControllerUIDevices'
import { v4 } from 'uuid'
import { ProjectHooks } from '../project/ProjectHooks'
import { State } from '../state/State'

export type ConfiguredController = {
  name: string
  enabled: boolean
  config: ControllerConfig
  device: string
  color?: string
  selected: {
    input: Option.Option<string>
    output: Option.Option<string>
  }
  id: string
}

export type ConfiguredControllers = Array<ConfiguredController>

const defaultConfiguredController = (name: string): ConfiguredController => ({
  name,
  enabled: true,
  config: ControllerConfig.empty(),
  device: ControllerDevices.defaultDevice.name,
  selected: {
    input: Option.none(),
    output: Option.none(),
  },
  id: v4(),
})

export type VirtualStore = Record<string, Color>

const atoms = {
  controllers: (name: string) =>
    State.storage<ConfiguredControllers>(`controllers-${name}`, []),
  virtualStore: State.mem<VirtualStore>('virtual-store', {}),
  virtualListener: State.mem<EventEmitter<MidiEventRecord>>(
    'virtual-listener',
    EventEmitter<MidiEventRecord>()
  ),
}

const useControllers = () => {
  const activeProject = ProjectHooks.useActiveProjectName()
  return React.useMemo(
    () => atoms.controllers(activeProject),
    [activeProject]
  ).useValue()
}

const useSetControllers = () => {
  const activeProject = ProjectHooks.useActiveProjectName()
  return React.useMemo(
    () => atoms.controllers(activeProject),
    [activeProject]
  ).useSet()
}

const RELOAD_PROJECT = 'reload-project'
const useRefreshControllers = () => {
  const setActiveProject = ProjectHooks.useSetActiveProject()

  return () => {
    setActiveProject((currentProject) => {
      setTimeout(() => {
        setActiveProject(currentProject)
      }, 500)
      return RELOAD_PROJECT
    })
  }
}

const useIsReloadProject = () => {
  return ProjectHooks.useActiveProjectName() === RELOAD_PROJECT
}

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

const useControllerStates = () => {
  const activeProject = ProjectHooks.useActiveProjectName()
  const controllers = React.useMemo(
    () => atoms.controllers(activeProject),
    [activeProject]
  )
  return controllers.array()
}

const useAddController = () => {
  const setControllers = useSetControllers()

  return (name: string) => {
    setControllers((c) => [...c, defaultConfiguredController(name)])
  }
}

const useRemoveController = () => {
  const setControllers = useSetControllers()
  return (controller: ConfiguredController) => {
    setControllers((cs) => cs.filter((c) => c !== controller))
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
  const manager = Midi.useDeviceManager()

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
  enabled: boolean
}

const useRealIO = (
  controller: ConfiguredController
): ConfiguredControllerIO => {
  const manager = Midi.useDeviceManager()

  const listener = React.useMemo(
    () =>
      Option.getOrElse(
        pipe(controller.selected.input, Option.flatMap(manager.getInput)),
        () => MidiDeviceManager.emptyListener()
      ),
    [controller]
  )

  const emitter = React.useMemo(
    () =>
      Option.getOrElse(
        pipe(controller.selected.output, Option.flatMap(manager.getOutput)),
        () => MidiDeviceManager.emptyEmitter()
      ),
    [controller]
  )

  return {
    emitter,
    listener,
    enabled: controller.enabled,
  }
}

const useUIStore = (controller: ConfiguredController) => {
  return ControllerUIDevices.useDevices()
    .getByName(controller.device)
    .useStore(controller.name)
}

const useVirtualListener = (controller: ConfiguredController) =>
  atoms.virtualListener.useValue()

const useVirtualIO = (
  controller: ConfiguredController
): ConfiguredControllerIO => {
  const putMessage = useUIStore(controller).usePut()
  const listener = useVirtualListener(controller)

  return {
    emitter: {
      send: (message: MidiMessage) => {
        putMessage(message)
      },
    },
    listener,
    enabled: controller.enabled,
  }
}

const useIO = (controller: ConfiguredController) => {
  const real = useRealIO(controller)
  const virtual = useVirtualIO(controller)

  const emitter: MidiEmitter = {
    send: (message: MidiMessage) => {
      real.emitter.send(message)
      virtual.emitter.send(message)
    },
  }
  const listener = EventEmitter<MidiEventRecord>()

  real.listener.on('*', listener.emit)

  virtual.listener.on('*', listener.emit)

  return {
    emitter,
    listener,
    enabled: controller.enabled,
  }
}

const useListeners = (): MidiListener => {
  return MidiDeviceManager.emptyListener()
}

export const ConfiguredController = {
  useController,
  useControllers,
  useIO,
  useRealIO,
  useVirtualIO,
  useVirtualListener,
  useListeners,
  useRealController,
  useMidiDeviceSelection,
  useControllerName,
  useAddController,
  useControllerStates,
  useProjectTracks,
  useRefreshControllers,
  useIsReloadProject,
}
