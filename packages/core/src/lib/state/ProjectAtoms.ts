import { atomWithBroadcast } from '../util/AtomWithBroadcast'
import { emptyArrangement, InitArrangement } from '../project/UIStateDisplay'

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

export const ProjectAtoms = {
  initArrangement: atomWithBroadcast<InitArrangement>('init-arrangement', []),
  importStatus: atomWithBroadcast<ProjectImportStatus>('import-status', {
    type: 'none',
  }),
  project: {
    abletonName: atomWithBroadcast<string | undefined>(
      'ableton-name',
      undefined
    ),
    arrangement: atomWithBroadcast('arrangement', emptyArrangement()),
  },
  realTime: {
    beats: atomWithBroadcast('real-time-beats', 0),
    barBeats: atomWithBroadcast('real-time-bar-beats', 1),
    timeSignature: atomWithBroadcast<TimeSignature>(
      'real-time-time-signature',
      {
        noteCount: 4,
        noteLength: 4,
      }
    ),
    tempo: atomWithBroadcast('real-time-tempo', 0),
    isPlaying: atomWithBroadcast('real-time-is-playing', false),
    metronomeState: atomWithBroadcast('real-time-metronome-state', false),
    loopState: atomWithBroadcast('real-time-loop-state', false),
    halfBeat: atomWithBroadcast('real-time-half-beat', false),
  },
}
