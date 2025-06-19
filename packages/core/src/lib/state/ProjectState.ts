import { emptyArrangement, InitArrangement } from '../project/UIStateDisplay'
import { State } from './State'
import { ProjectConfig, ProjectsConfig } from '../project/ProjectConfig'

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

export const ProjectState = {
  initArrangement: State.mem<InitArrangement>('init-arrangement', []),
  importStatus: State.mem<ProjectImportStatus>('import-status', {
    type: 'none',
  }),
  project: {
    config: State.storage<ProjectsConfig>(
      'projects-config',
      ProjectConfig.defaultProjectsConfig()
    ),
    active: State.storage<string>('active-project', 'default'),
    abletonName: State.mem<string | undefined>('ableton-name', undefined),
    arrangement: State.mem('arrangement', emptyArrangement()),
  },
  realTime: {
    beats: State.mem('real-time-beats', 0),
    barBeats: State.mem('real-time-bar-beats', 1),
    timeSignature: State.mem<TimeSignature>('real-time-time-signature', {
      noteCount: 4,
      noteLength: 4,
    }),
    tempo: State.mem('real-time-tempo', 0),
    isPlaying: State.mem('real-time-is-playing', false),
    metronomeState: State.mem('real-time-metronome-state', false),
    loopState: State.mem('real-time-loop-state', false),
    halfBeat: State.mem('real-time-half-beat', false),
  },
}
