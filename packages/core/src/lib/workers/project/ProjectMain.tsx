import { EventEmitter } from '../../EventEmitter'
import { MidiEventRecord } from '../../midi/MidiDevice'
import {
  AbletonUIMessage,
  parseAbletonUIMessage,
  TX_MESSAGE,
} from '../../project/AbletonUIMessage'
import {
  initArrangement,
  initClip,
  initCue,
  initDone,
  initTrack,
} from '../../project/UIStateDisplay'
import { ProjectState } from '../../state/ProjectState'
import { ConfiguredController } from '../../controllers/ConfiguredController'

const listener = (dawListener: EventEmitter<MidiEventRecord>) => {
  const onAbletonUIMessage = (msg: AbletonUIMessage) => {
    if (msg.type === 'init-ack') {
      ProjectState.importStatus.set({
        type: 'ack',
        projectName: msg.projectName,
      })
      ProjectState.project.abletonName.set(msg.projectName)
    } else if (msg.type === 'init-project') {
      ProjectState.importStatus.set({ type: 'importing' })
      ProjectState.initArrangement.set(initArrangement(msg))
    } else if (msg.type === 'init-track') {
      ProjectState.initArrangement.set(initTrack(msg))
    } else if (msg.type === 'init-clip') {
      ProjectState.initArrangement.set(initClip(msg))
    } else if (msg.type === 'init-cue') {
      ProjectState.initArrangement.set(initCue(msg))
    } else if (msg.type === 'init-done') {
      ProjectState.importStatus.set({ type: 'finalizing' })
      const arrangement = initDone(ProjectState.initArrangement.get())
      ProjectState.project.arrangement.set(arrangement)
      ProjectState.importStatus.set({ type: 'done' })
    } else if (msg.type === 'beat') {
      ProjectState.realTime.beats.set(msg.value)
    } else if (msg.type === 'sig') {
      ProjectState.realTime.timeSignature.set({
        noteCount: msg.numer,
        noteLength: msg.denom,
      })
    } else if (msg.type === 'bar-beat') {
      ProjectState.realTime.barBeats.set(msg.value)
    } else if (msg.type === 'tempo') {
      ProjectState.realTime.tempo.set(msg.value)
    } else if (msg.type === 'is-playing') {
      ProjectState.realTime.isPlaying.set(msg.value)
    } else if (msg.type === 'metronome-state') {
      ProjectState.realTime.metronomeState.set(msg.value)
    } else if (msg.type === 'loop-state') {
      ProjectState.realTime.loopState.set(msg.value)
    } else if (msg.type === 'half-beat') {
      ProjectState.realTime.halfBeat.set(msg.isHalf)
    }
  }

  dawListener.on('sysex', (sysex) => {
    const msg = parseAbletonUIMessage(sysex)
    if (msg !== undefined) {
      onAbletonUIMessage(msg)
    }
  })
}

const handshake = (dawEmitter: EventEmitter<MidiEventRecord>) => {
  dawEmitter.emit(TX_MESSAGE.init())

  ProjectState.importStatus.sub((importStatus) => {
    if (importStatus.type === 'ack') {
      dawEmitter.emit(
        TX_MESSAGE.initReady(['Songs', 'Parts', 'Chris Keyboard']) // TODO: Get real tracks
      )
    }
  })
}

const onActiveProject = () => {}

const init = (
  dawListener: EventEmitter<MidiEventRecord>,
  dawEmitter: EventEmitter<MidiEventRecord>
) => {
  console.log('Project Main')
  ProjectState.project.active.sub((activeProject) => {
    console.log('active project', activeProject)
  })
  listener(dawListener)
  handshake(dawEmitter)
}

export const ProjectMain = {
  init,
}
