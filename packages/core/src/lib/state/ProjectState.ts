import { emptyArrangement, InitArrangement } from '../project/UIStateDisplay'
import { State } from './State'
import { ProjectsConfig } from '../project/ProjectConfig'
import { DefaultProjectsConfig } from '../project/DefaultProjectConfig'

export type TimeSignature = {
  noteCount: number
  noteLength: number
}

export type ProjectImportStatus =
  | { type: 'none' }
  | { type: 'ack'; projectName: string }
  | { type: 'importing' }
  | { type: 'finalizing' }
  | { type: 'resend'; missingMessageIds: Array<number> }
  | { type: 'done'; sourceMessageCount: number; parsedMessageCount: number }
  | { type: 'error'; msg: string }

export const ProjectState = {
  initArrangement: State.mem<InitArrangement>(
    'project',
    'init-arrangement',
    []
  ),
  importMessageCount: State.mem('project', 'import-message-count', 0),
  importStatus: State.mem<ProjectImportStatus>('project', 'import-status', {
    type: 'none',
  }),
  project: {
    config: State.storageSchema(
      'projects-config',
      DefaultProjectsConfig(),
      ProjectsConfig.Schema
    ),
    abletonName: State.mem<string | undefined>(
      'project',
      'ableton-name',
      undefined
    ),
    arrangement: State.mem('project', 'arrangement', emptyArrangement()),
  },
  realTime: {
    beats: State.mem('project', 'real-time-beats', 0),
    barBeats: State.mem('project', 'real-time-bar-beats', 1),
    timeSignature: State.mem<TimeSignature>(
      'project',
      'real-time-time-signature',
      {
        noteCount: 4,
        noteLength: 4,
      }
    ),
    tempo: State.mem('project', 'real-time-tempo', 0),
    isPlaying: State.mem('project', 'real-time-is-playing', false),
    metronomeState: State.mem('project', 'real-time-metronome-state', false),
    loopState: State.mem('project', 'real-time-loop-state', false),
    tick: State.mem('project', 'real-time-tick', 0),
  },
}
