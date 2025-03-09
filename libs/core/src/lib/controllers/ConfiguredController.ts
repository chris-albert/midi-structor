import { atomFamily, splitAtom } from 'jotai/utils'
import { useAtomValue, useSetAtom, useAtom, atom, WritableAtom, PrimitiveAtom } from 'jotai'
import { AtomStorage } from '../storage/AtomStorage'
import { ProjectMidi } from '../project/ProjectMidi'
import { Option } from 'effect'
import React from 'react'
import { focusAtom } from 'jotai-optics'
import _ from 'lodash'

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

const useController = (controller: PrimitiveAtom<ConfiguredController>) => {
  const controllerValue = useAtomValue(controller)
  const [name] = useAtom(focusAtom(controller, (s) => s.prop('name')))
  const [type, setType] = useAtom(focusAtom(controller, (s) => s.prop('type')))
  const [enabled, setEnabled] = useAtom(focusAtom(controller, (s) => s.prop('enabled')))
  const selected = focusAtom(controller, (s) => s.prop('selected'))
  const [input, setInput] = useAtom(focusAtom(selected, (s) => s.prop('input')))
  const [output, setOutput] = useAtom(focusAtom(selected, (s) => s.prop('output')))
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

export const ConfiguredController = {
  useController,
  useControllerName,
  useAddController,
  useControllersValue,
}
