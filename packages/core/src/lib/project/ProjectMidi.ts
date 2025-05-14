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
import {
  AbletonUIMessage,
  parseAbletonUIMessage,
  TX_MESSAGE,
} from './AbletonUIMessage'
import React from 'react'
import { AtomStorage } from '../storage/AtomStorage'
import { MIDIStructorUI } from '../controllers/devices/MIDIStructorUI'
import { Schema } from 'effect'
import { ProjectHooks } from './ProjectHooks'

const store = getDefaultStore()

export const ProjectConfig = Schema.Struct({
  label: Schema.String,
  key: Schema.String,
  style: Schema.Struct({
    accent: Schema.Struct({
      color1: Schema.String,
      color2: Schema.String,
    }),
  }),
})

export type ProjectConfig = Schema.Schema.Type<typeof ProjectConfig>

export const ProjectsConfig = Schema.Struct({
  projects: Schema.Array(ProjectConfig),
})

export type ProjectsConfig = Schema.Schema.Type<typeof ProjectsConfig>

const defaultProjectConfig = (): ProjectConfig => ({
  label: 'Default',
  key: 'default',
  style: {
    accent: {
      color1: '#6a11cb',
      color2: '#2575fc',
    },
  },
})

const defaultProjectsConfig: () => ProjectsConfig = () => ({
  projects: [defaultProjectConfig()],
})

export type TimeSignature = {
  noteCount: number
  noteLength: number
}

export type ProjectImportStatus =
  | { type: 'none' }
  | { type: 'ack'; projectName: string }
  | { type: 'importing' }
  | { type: 'finalizing' }
  | { type: 'done' }
  | { type: 'error'; msg: string }

const atoms = {
  initArrangement: atom<InitArrangement>([]),
  importStatus: atom<ProjectImportStatus>({ type: 'none' }),
  projectsConfig: AtomStorage.atom<ProjectsConfig>(
    'projects-config',
    defaultProjectsConfig()
  ),
  project: {
    active: AtomStorage.atom('active-project', 'default'),
    abletonName: atom<string | undefined>(undefined),
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

  const setAbletonProjectName = useSetAtom(atoms.project.abletonName)

  React.useEffect(() => {
    if (importStatus.type === 'finalizing') {
      const arrangement = initDone(store.get(atoms.initArrangement))
      setArrangement(arrangement)
      setImportStatus({ type: 'done' })
    }
  }, [importStatus])

  const onAbletonUIMessage = (msg: AbletonUIMessage) => {
    if (msg.type === 'init-ack') {
      setImportStatus({ type: 'ack', projectName: msg.projectName })
      setAbletonProjectName(msg.projectName)
    } else if (msg.type === 'init-project') {
      setImportStatus({ type: 'importing' })
      setInitArrangement(initArrangement(msg))
    } else if (msg.type === 'init-track') {
      setInitArrangement(initTrack(msg))
    } else if (msg.type === 'init-clip') {
      setInitArrangement(initClip(msg))
    } else if (msg.type === 'init-cue') {
      setInitArrangement(initCue(msg))
    } else if (msg.type === 'init-done') {
      store.set(atoms.importStatus, { type: 'finalizing' })
      setImportStatus({ type: 'finalizing' })
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
  const dawEmitter = Midi.useDawEmitter()
  const ableton = useAbletonUIMessages()
  const onMidiStructor = useGlobalMidiStructorStore().usePut()

  React.useEffect(() => {
    dawEmitter.send(TX_MESSAGE.init())
  }, [dawEmitter])

  ProjectHooks.useOnStatusChange((status) => {
    if (status.type === 'ack') {
      dawEmitter.send(TX_MESSAGE.initReady([]))
    }
  })

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
  defaultProjectsConfig,
  defaultProjectConfig,
  atoms,
}
