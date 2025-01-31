import { atomWithStorage, createJSONStorage } from 'jotai/utils'
import { emptyWidgets, Widgets } from '../model/Widgets'
import { useAtom, useAtomValue } from 'jotai/index'
import { ProjectMidi } from '@midi-structor/core'
import React from 'react'

const atoms = {
  widgets: (name: string) =>
    atomWithStorage<Widgets>(`widgets-${name}`, emptyWidgets, createJSONStorage(), {
      getOnInit: true,
    }),
}

const useWidgets = () => {
  const activeProject = useAtomValue(ProjectMidi.atoms.project.active)
  return useAtom(React.useMemo(() => atoms.widgets(activeProject), [activeProject]))
}

export const UIWidgets = {
  useWidgets,
}
