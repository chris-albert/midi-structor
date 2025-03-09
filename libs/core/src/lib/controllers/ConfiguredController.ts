import { atomFamily, splitAtom } from 'jotai/utils'
import { useAtomValue, useAtom, PrimitiveAtom } from 'jotai'
import { AtomStorage } from '../storage/AtomStorage'
import { ProjectMidi } from '../project/ProjectMidi'
import { Option } from 'effect'
import React from 'react'
import { focusAtom } from 'jotai-optics'
import { OpticFor_ } from 'optics-ts'
import { Midi, MidiDeviceSelection } from '../midi/GlobalMidi'

export type ConfiguredControllerType = 'virtual' | 'real'

export type ConfiguredController = {
  name: string
  type: ConfiguredControllerType
  enabled: boolean
  selected: {
    input: Option.Option<string>
    output: Option.Option<string>
  }
}

export type ConfiguredControllers = Array<ConfiguredController>

const defaultConfiguredController = (name: string): ConfiguredController => ({
  name,
  type: 'virtual',
  enabled: false,
  selected: {
    input: Option.none(),
    output: Option.none(),
  },
})

const atoms = {
  controllers: atomFamily((name: string) =>
    AtomStorage.atom<ConfiguredControllers>(`controllers-${name}`, [])
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
  const selected = useSafeFocus(controller, 'selected')
  const [input, setInput] = useAtom(useSafeFocus(selected, 'input'))
  const [output, setOutput] = useAtom(useSafeFocus(selected, 'output'))
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
    input,
    setInput,
    output,
    setOutput,
    remove,
  }
}

export type ControllerMidiDeviceSelections = {
  input: MidiDeviceSelection
  output: MidiDeviceSelection
}

const useMidiDeviceSelection = (
  controllerAtom: PrimitiveAtom<ConfiguredController>
): ControllerMidiDeviceSelections => {
  const controller = useController(controllerAtom)
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

export const ConfiguredController = {
  useController,
  useMidiDeviceSelection,
  useControllerName,
  useAddController,
  useControllersValue,
}
