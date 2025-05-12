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
import { atomFamily } from 'jotai/utils'
import { AbletonUIMessage, parseAbletonUIMessage } from './AbletonUIMessage'
import React from 'react'
import { AtomStorage } from '../storage/AtomStorage'
import { MIDIStructorUI } from '../controllers/devices/MIDIStructorUI'
import { Schema } from 'effect'

const store = getDefaultStore()

export const ProjectConfig = Schema.Struct({
  label: Schema.String,
  key: Schema.String,
})

export type ProjectConfig = Schema.Schema.Type<typeof ProjectConfig>

export const ProjectsConfig = Schema.Struct({
  projects: Schema.Array(ProjectConfig),
})

export type ProjectsConfig = Schema.Schema.Type<typeof ProjectsConfig>

const defaultProjectsConfig: () => ProjectsConfig = () => ({
  projects: [
    {
      label: 'Default',
      key: 'default',
    },
  ],
})

export type TimeSignature = {
  noteCount: number
  noteLength: number
}

export type ProjectImportStatus =
  | 'none'
  | 'importing'
  | 'finalizing'
  | 'done'
  | 'error'

const atoms = {
  initArrangement: atom<InitArrangement>([]),
  importStatus: atom<ProjectImportStatus>('none'),
  projectsConfig: AtomStorage.atom<ProjectsConfig>(
    'projects-config',
    defaultProjectsConfig()
  ),
  project: {
    active: AtomStorage.atom('active-project', 'default'),
    arrangement: atomFamily((name: string) =>
      AtomStorage.atom<UIArrangement>(`arrangement-${name}`, emptyArrangement())
    ),
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
    metronomeState: atom(false),
    loopState: atom(false),
  },
}

const useAbletonUIMessages = () => {
  const [importStatus, setImportStatus] = useAtom(atoms.importStatus)
  const active = useAtomValue(atoms.project.active)
  const setArrangement = useSetAtom(atoms.project.arrangement(active))
  const setInitArrangement = useSetAtom(atoms.initArrangement)
  const setBeats = useSetAtom(atoms.realTime.beats)
  const setBarBeats = useSetAtom(atoms.realTime.barBeats)
  const setTimeSignature = useSetAtom(atoms.realTime.timeSignature)
  const setTempo = useSetAtom(atoms.realTime.tempo)
  const setIsPlaying = useSetAtom(atoms.realTime.isPlaying)
  const setMetronomeState = useSetAtom(atoms.realTime.metronomeState)
  const setLoopState = useSetAtom(atoms.realTime.loopState)

  React.useEffect(() => {
    if (importStatus === 'finalizing') {
      const arrangement = initDone(store.get(atoms.initArrangement))
      setArrangement(arrangement)
      setImportStatus('done')
    }
  }, [importStatus])

  const onAbletonUIMessage = (msg: AbletonUIMessage) => {
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
    } else if (msg.type === 'metronome-state') {
      setMetronomeState(msg.value)
    } else if (msg.type === 'loop-state') {
      setLoopState(msg.value)
    }
  }

  return { onAbletonUIMessage }
}

const useGlobalMidiStructorStore = () =>
  MIDIStructorUI.useStore('global:MIDIStructorUI')

const useProjectListener = () => {
  const dawListener = Midi.useDawListener()
  const ableton = useAbletonUIMessages()
  const onMidiStructor = useGlobalMidiStructorStore().usePut()

  React.useEffect(() => {
    return dawListener.on('sysex', (sysex) => {
      const msg = parseAbletonUIMessage(sysex)
      if (msg !== undefined) {
        ableton.onAbletonUIMessage(msg)
      } else {
        onMidiStructor(sysex)
      }
    })
  }, [dawListener])
}

export const ProjectMidi = {
  useProjectListener,
  useGlobalMidiStructorStore,
  atoms,
}
