import { atomFamily, splitAtom } from 'jotai/utils'
import { useAtomValue, useAtom, PrimitiveAtom, atom, useSetAtom } from 'jotai'
import { AtomStorage } from '../storage/AtomStorage'
import { ProjectMidi } from '../project/ProjectMidi'
import { Option, pipe } from 'effect'
import React from 'react'
import { focusAtom } from 'jotai-optics'
import { OpticFor_ } from 'optics-ts'
import { Midi, MidiDeviceSelection, MidiEmitter, MidiListener } from '../midi/GlobalMidi'
import { MidiDeviceManager } from '../midi/MidiDeviceManager'
import { MidiMessage, SysExMessage } from '../midi/MidiMessage'
import { EventEmitter } from '../EventEmitter'
import { MidiEventRecord } from '../midi/MidiDevice'
import { Color } from './Color'
import { ControllerConfig } from './ControllerConfig'

export type ConfiguredControllerType = 'virtual' | 'real'

export type ConfiguredControllerBase = {
  name: string
  enabled: boolean
  config: ControllerConfig
}

export type RealConfiguredController = {
  type: 'real'
  selected: {
    input: Option.Option<string>
    output: Option.Option<string>
  }
} & ConfiguredControllerBase

export type VirtualConfiguredController = {
  type: 'virtual'
} & ConfiguredControllerBase

export type ConfiguredController = RealConfiguredController | VirtualConfiguredController

export type ConfiguredControllers = Array<ConfiguredController>

const defaultConfiguredController = (name: string): ConfiguredController => ({
  name,
  type: 'virtual',
  enabled: true,
  config: ControllerConfig.empty(),
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
  const activeProject = useAtomValue(ProjectMidi.atoms.project.active)
  return useAtom(atoms.controllers(activeProject))
}

const useControllerAtoms = () => {
  const activeProject = useAtomValue(ProjectMidi.atoms.project.active)
  const controllers = React.useMemo(() => atoms.controllers(activeProject), [activeProject])
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
  const nameAtom = React.useMemo(() => focusAtom(controller, (s) => s.prop('name')), [])
  return useAtomValue(nameAtom)
}

const useSafeFocus = <A, K extends keyof A>(atom: PrimitiveAtom<A>, key: K) => {
  const selectFunc = React.useCallback((o: OpticFor_<A>) => o.prop(key), [key])
  return focusAtom(atom, selectFunc)
}

const useController = (controller: PrimitiveAtom<ConfiguredController>) => {
  const controllerValue = useAtomValue(controller)
  const [name] = useAtom(useSafeFocus(controller, 'name'))
  const [type, setType] = useAtom(useSafeFocus(controller, 'type'))
  const [enabled, setEnabled] = useAtom(useSafeFocus(controller, 'enabled'))
  const [config, setConfig] = useAtom(useSafeFocus(controller, 'config'))
  const removeController = useRemoveController()

  const remove = () => {
    removeController(controllerValue)
  }

  return {
    name,
    type,
    setType,
    enabled,
    setEnabled,
    config,
    setConfig,
    remove,
    controller: controllerValue,
  }
}

const useRealController = (controller: PrimitiveAtom<RealConfiguredController>) => {
  const baseController = useController(controller as PrimitiveAtom<ConfiguredController>)
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
  controllerAtom: PrimitiveAtom<RealConfiguredController>
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

const useRealIO = (controller: RealConfiguredController): ConfiguredControllerIO => {
  const manager = Midi.useDeviceManager()

  const inputListener = pipe(controller.selected.input, Option.flatMap(manager.getInput))
  const outputEmitter = pipe(controller.selected.output, Option.flatMap(manager.getOutput))

  return {
    emitter: Option.getOrElse(outputEmitter, () => MidiDeviceManager.emptyEmitter()),
    listener: Option.getOrElse(inputListener, () => MidiDeviceManager.emptyListener()),
    enabled: controller.enabled,
  }
}

const useVirtualStore = (controller: VirtualConfiguredController) => {
  return useAtomValue(atoms.virtualStore(controller.name))
}

const colorsFromSysex = (sysex: SysExMessage): Array<[string, Color]> => {
  const colors: Array<[string, Color]> = []
  const colorsArray = sysex.body.slice(5)
  while (colorsArray.length >= 4) {
    colorsArray.shift()
    const target = colorsArray.shift()
    const red = colorsArray.shift()
    const green = colorsArray.shift()
    const blue = colorsArray.shift()
    const color = Color.fromRGB(red * 2, green * 2, blue * 2)
    colors.push([`${target}`, color])
  }
  return colors
}

const useVirtualSetStore = (controller: VirtualConfiguredController) => {
  const setStore = useSetAtom(atoms.virtualStore(controller.name))

  const onMessage = (message: MidiMessage) => {
    if (message.type === 'sysex') {
      const colors = colorsFromSysex(message)
      const newStore: VirtualStore = {}
      colors.forEach((color) => {
        newStore[color[0]] = color[1]
      })
      setStore((s) => ({ ...s, ...newStore }))
    }
  }

  return {
    onMessage,
  }
}

const useVirtualListener = (controller: VirtualConfiguredController) =>
  useAtomValue(atoms.virtualListener(controller.name))

const useVirtualIO = (controller: VirtualConfiguredController): ConfiguredControllerIO => {
  const store = useVirtualSetStore(controller)
  const listener = useVirtualListener(controller)

  return {
    emitter: {
      send: (message: MidiMessage) => {
        store.onMessage(message)
      },
    },
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
  useRealIO,
  useVirtualIO,
  useVirtualStore,
  useVirtualListener,
  useListeners,
  useRealController,
  useMidiDeviceSelection,
  useControllerName,
  useAddController,
  useControllersValue,
}
