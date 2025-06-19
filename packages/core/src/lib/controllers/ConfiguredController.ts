import { atomFamily, splitAtom } from 'jotai/utils'
import { useAtomValue, useAtom, PrimitiveAtom, atom, useSetAtom } from 'jotai'
import { AtomStorage } from '../storage/AtomStorage'
import { Option, pipe } from 'effect'
import React from 'react'
import { focusAtom } from 'jotai-optics'
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
  controllers: atomFamily((name: string) =>
    AtomStorage.atom<ConfiguredControllers>(`controllers-${name}`, [])
  ),
  virtualStore: atomFamily((name: string) => atom<VirtualStore>({})),
  virtualListener: atomFamily((name: string) =>
    atom<EventEmitter<MidiEventRecord>>(EventEmitter<MidiEventRecord>())
  ),
}

const useControllers = () => {
  const activeProject = ProjectHooks.useActiveProjectName()
  return useAtom(atoms.controllers(activeProject))
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
  const [controllers] = useControllers()

  const widgets = controllers.flatMap((controller) =>
    Option.match(ControllerDevices.findByName(controller.device), {
      onSome: (device) => device.widgets.resolve(controller.config),
      onNone: () => [],
    })
  )
  return Set(widgets.flatMap((widget) => widget.tracks())).toArray()
}

const useControllerAtoms = () => {
  const activeProject = ProjectHooks.useActiveProjectName()
  const controllers = React.useMemo(
    () => atoms.controllers(activeProject),
    [activeProject]
  )
  return splitAtom(controllers)
}

const useAddController = () => {
  const [_, setControllers] = useControllers()

  return (name: string) => {
    setControllers((c) => [...c, defaultConfiguredController(name)])
  }
}

const useControllersValue = () => {
  return useAtomValue(useControllerAtoms())
}

const useRemoveController = () => {
  const [_, setControllers] = useControllers()
  return (controller: ConfiguredController) => {
    setControllers((cs) => cs.filter((c) => c !== controller))
  }
}

const useControllerName = (controller: PrimitiveAtom<ConfiguredController>) => {
  const nameAtom = React.useMemo(
    () => focusAtom(controller, (s) => s.prop('name')),
    []
  )
  return useAtomValue(nameAtom)
}

const useSafeFocus = <A, K extends keyof A>(atom: PrimitiveAtom<A>, key: K) => {
  const selectFunc = React.useCallback((o: OpticFor_<A>) => o.prop(key), [key])
  return focusAtom(atom, selectFunc)
}

const useController = (controller: PrimitiveAtom<ConfiguredController>) => {
  const controllerValue = useAtomValue(controller)
  const [name, setName] = useAtom(useSafeFocus(controller, 'name'))
  const [enabled, setEnabled] = useAtom(useSafeFocus(controller, 'enabled'))
  const [config, setConfig] = useAtom(useSafeFocus(controller, 'config'))
  const [device, setDevice] = useAtom(useSafeFocus(controller, 'device'))
  const [color, setColor] = useAtom(useSafeFocus(controller, 'color'))
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

const useRealController = (controller: PrimitiveAtom<ConfiguredController>) => {
  const baseController = useController(
    controller as PrimitiveAtom<ConfiguredController>
  )
  const selected = useSafeFocus(controller, 'selected')
  const [input, setInput] = useAtom(useSafeFocus(selected, 'input'))
  const [output, setOutput] = useAtom(useSafeFocus(selected, 'output'))

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
  controllerAtom: PrimitiveAtom<ConfiguredController>
): ControllerMidiDeviceSelections => {
  const controller = useRealController(controllerAtom)
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
  useAtomValue(atoms.virtualListener(controller.name))

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
  useControllersValue,
  useProjectTracks,
  useRefreshControllers,
  useIsReloadProject,
}
