import { atomFamily } from 'jotai/utils'
import { useAtomValue, useSetAtom, useAtom } from 'jotai'
import { AtomStorage } from '../storage/AtomStorage'
import { ProjectMidi } from '../project/ProjectMidi'

export type ConfiguredControllerType = 'virtual' | 'real'
export type ConfiguredController = {
  name: string
  type: ConfiguredControllerType
}

export type ConfiguredControllers = Array<ConfiguredController>

const atoms = {
  controllers: atomFamily((name: string) =>
    AtomStorage.atom<ConfiguredControllers>(`controllers-${name}`, [])
  ),
}

const useControllers = () => {
  const activeProject = useAtomValue(ProjectMidi.atoms.project.active)
  return useAtom(atoms.controllers(activeProject))
}

const useAddController = () => {
  const [_, setControllers] = useControllers()

  return (name: string) => {
    setControllers((c) => [...c, { name, type: 'virtual' }])
  }
}

const useControllersValue = () => {
  return useControllers()[0]
}

const useRemoveController = () => {
  const [_, setControllers] = useControllers()
  return (controller: ConfiguredController) => {
    setControllers((cs) => cs.filter((c) => c !== controller))
  }
}

const useUpdateController = (orig: ConfiguredController) => {
  const [_, setControllers] = useControllers()
  return (updated: ConfiguredController) => {
    setControllers((cs) => cs.map((c) => (c === orig ? updated : c)))
  }
}

export const ConfiguredController = {
  useAddController,
  useControllersValue,
  useRemoveController,
  useUpdateController,
}
