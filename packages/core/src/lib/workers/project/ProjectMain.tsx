import { getDefaultStore } from 'jotai'
import { EventEmitter } from '../../EventEmitter'
import { MidiEventRecord } from '../../midi/MidiDevice'
import {
  AbletonUIMessage,
  parseAbletonUIMessage,
} from '../../project/AbletonUIMessage'
import {
  initArrangement,
  initClip,
  initCue,
  initDone,
  initTrack,
} from '../../project/UIStateDisplay'
import { ProjectAtoms } from '../../state/ProjectAtoms'

const store = getDefaultStore()

const init = (dawListener: EventEmitter<MidiEventRecord>) => {
  const onAbletonUIMessage = (msg: AbletonUIMessage) => {
    if (msg.type === 'init-ack') {
      store.set(ProjectAtoms.importStatus, {
        type: 'ack',
        projectName: msg.projectName,
      })
      store.set(ProjectAtoms.project.abletonName, msg.projectName)
    } else if (msg.type === 'init-project') {
      store.set(ProjectAtoms.importStatus, { type: 'importing' })
      store.set(ProjectAtoms.initArrangement, initArrangement(msg))
    } else if (msg.type === 'init-track') {
      store.set(ProjectAtoms.initArrangement, initTrack(msg))
    } else if (msg.type === 'init-clip') {
      store.set(ProjectAtoms.initArrangement, initClip(msg))
    } else if (msg.type === 'init-cue') {
      store.set(ProjectAtoms.initArrangement, initCue(msg))
    } else if (msg.type === 'init-done') {
      store.set(ProjectAtoms.importStatus, { type: 'finalizing' })
      const arrangement = initDone(store.get(ProjectAtoms.initArrangement))
      store.set(ProjectAtoms.project.arrangement, arrangement)
      store.set(ProjectAtoms.importStatus, { type: 'done' })
    } else if (msg.type === 'beat') {
      store.set(ProjectAtoms.realTime.beats, msg.value)
    } else if (msg.type === 'sig') {
      store.set(ProjectAtoms.realTime.timeSignature, {
        noteCount: msg.numer,
        noteLength: msg.denom,
      })
    } else if (msg.type === 'bar-beat') {
      store.set(ProjectAtoms.realTime.barBeats, msg.value)
    } else if (msg.type === 'tempo') {
      store.set(ProjectAtoms.realTime.tempo, msg.value)
    } else if (msg.type === 'is-playing') {
      store.set(ProjectAtoms.realTime.isPlaying, msg.value)
    } else if (msg.type === 'metronome-state') {
      store.set(ProjectAtoms.realTime.metronomeState, msg.value)
    } else if (msg.type === 'loop-state') {
      store.set(ProjectAtoms.realTime.loopState, msg.value)
    } else if (msg.type === 'half-beat') {
      store.set(ProjectAtoms.realTime.halfBeat, msg.isHalf)
    }
  }

  dawListener.on('sysex', (sysex) => {
    const msg = parseAbletonUIMessage(sysex)
    if (msg !== undefined) {
      onAbletonUIMessage(msg)
    }
  })
}

export const ProjectMain = {
  init,
}
