import { Midi } from '../midi/GlobalMidi'
import {
  emptyArrangement,
  initArrangement,
  InitArrangement,
  initClip,
  initCue,
  initDone,
  initTrack,
  UIArrangement,
} from './UIStateDisplay'
import { atom, getDefaultStore, useAtom, useAtomValue, useSetAtom } from 'jotai'
import { parseAbletonUIMessage } from './AbletonUIMessage'
import * as t from 'io-ts'
import { atomWithStorage, splitAtom } from 'jotai/utils'
import { createJSONStorage } from 'jotai/utils'
import React from 'react'

const store = getDefaultStore()

export const ProjectConfig = t.type({
  name: t.string,
})

export type ProjectConfig = t.TypeOf<typeof ProjectConfig>

export const ProjectsConfig = t.type({
  projects: t.record(t.string, ProjectConfig),
})

export type ProjectsConfig = t.TypeOf<typeof ProjectsConfig>

const defaultProjectsConfig: () => ProjectsConfig = () => ({
  projects: {
    default: {
      name: 'Default',
    },
  },
})

export type TimeSignature = {
  noteCount: number
  noteLength: number
}

export type ProjectImportStatus = 'none' | 'importing' | 'finalizing' | 'done' | 'error'

const atoms = {
  initArrangement: atom<InitArrangement>([]),
  importStatus: atom<ProjectImportStatus>('none'),
  projectsConfig: atomWithStorage<ProjectsConfig>(
    'projects-config',
    defaultProjectsConfig(),
    createJSONStorage(),
    {
      getOnInit: true,
    },
  ),
  project: {
    active: atomWithStorage('active-project', 'default'),
    arrangement: (name: string) =>
      atomWithStorage<UIArrangement>(`arrangement-${name}`, emptyArrangement(), createJSONStorage(), {
        getOnInit: true,
      }),
    // widgets: (name: string) =>
    //   atomWithStorage<Widgets>(`widgets-${name}`, emptyWidgets, createJSONStorage(), {
    //     getOnInit: true,
    //   }),
  },
  realTime: {
    beats: atom(0),
    barBeats: atom(1),
    timeSignature: atom<TimeSignature>({
      noteCount: 4,
      noteLength: 4,
    }),
    tempo: atom(0),
    isPlaying: atom(false),
  },
}

const useProjectListener = () => {
  const dawListener = Midi.useDawListener()

  const [importStatus, setImportStatus] = useAtom(atoms.importStatus)
  const active = useAtomValue(atoms.project.active)
  const setArrangement = useSetAtom(atoms.project.arrangement(active))
  const setInitArrangement = useSetAtom(atoms.initArrangement)
  const setBeats = useSetAtom(atoms.realTime.beats)
  const setBarBeats = useSetAtom(atoms.realTime.barBeats)
  const setTimeSignature = useSetAtom(atoms.realTime.timeSignature)
  const setTempo = useSetAtom(atoms.realTime.tempo)
  const setIsPlaying = useSetAtom(atoms.realTime.isPlaying)

  React.useEffect(() => {
    if (importStatus === 'finalizing') {
      const arrangement = initDone(store.get(atoms.initArrangement))
      setArrangement(arrangement)
      setImportStatus('done')
    }
  }, [importStatus])

  React.useEffect(() => {
    return dawListener.on('sysex', (sysex) => {
      const msg = parseAbletonUIMessage(sysex)
      if (msg !== undefined) {
        if (msg.type === 'init-project') {
          setImportStatus('importing')
          setInitArrangement(initArrangement(msg))
        } else if (msg.type === 'init-track') {
          setInitArrangement(initTrack(msg))
        } else if (msg.type === 'init-clip') {
          setInitArrangement(initClip(msg))
        } else if (msg.type === 'init-cue') {
          setInitArrangement(initCue(msg))
        } else if (msg.type === 'init-done') {
          store.set(atoms.importStatus, 'finalizing')
          setImportStatus('finalizing')
        } else if (msg.type === 'beat') {
          setBeats(msg.value)
        } else if (msg.type === 'sig') {
          setTimeSignature({
            noteCount: msg.numer,
            noteLength: msg.denom,
          })
        } else if (msg.type === 'bar-beat') {
          setBarBeats(msg.value)
        } else if (msg.type === 'tempo') {
          setTempo(msg.value)
        } else if (msg.type === 'is-playing') {
          setIsPlaying(msg.value)
        }
      }
    })
  }, [dawListener])
}

export const ProjectMidi = {
  useProjectListener,
  atoms,
}
