import { emptyWidgets, Widgets } from '../model/Widgets'
import { useAtom, useAtomValue } from 'jotai/index'
import { AtomStorage, ProjectMidi } from '@midi-structor/core'
import { atomFamily } from 'jotai/utils'

const atoms = {
  widgets: atomFamily((name: string) => AtomStorage.atom<Widgets>(`widgets-${name}`, emptyWidgets)),
}

const useWidgets = () => {
  const activeProject = useAtomValue(ProjectMidi.atoms.project.active)
  return useAtom(atoms.widgets(activeProject))
}

export const UIWidgets = {
  useWidgets,
}
