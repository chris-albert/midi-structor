import { EventEmitter } from '../../EventEmitter'
import { MidiEventRecord } from '../../midi/MidiDevice'
import {
  AbletonUIMessage,
  parseAbletonUIMessage,
  TX_MESSAGE,
} from '../../project/AbletonUIMessage'
import { ProjectConfig, ProjectsConfig } from '../../project/ProjectConfig'
import {
  initArrangement,
  initClip,
  initCue,
  initDone,
  initTrack,
} from '../../project/UIStateDisplay'
import { ProjectState } from '../../state/ProjectState'
import _ from 'lodash'
import { Option } from 'effect'
import { ControllerDevices } from '../../controllers/devices/ControllerDevices'
import { Set } from 'immutable'
import { DefaultProjectConfig } from '../../project/DefaultProjectConfig'
import { log } from '../../logger/log'

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

const handshake = (
  dawEmitter: EventEmitter<MidiEventRecord>,
  tracks: Array<string>
) => {
  dawEmitter.emit(TX_MESSAGE.init())

  return ProjectState.importStatus.sub((importStatus) => {
    if (importStatus.type === 'ack') {
      dawEmitter.emit(TX_MESSAGE.initReady(tracks))
    }
  })
}

const getActiveProjectConfig = (projects: ProjectsConfig): ProjectConfig =>
  _.find(projects.projects, (p) => p.key === projects.active) ||
  DefaultProjectConfig()

const getTracks = (config: ProjectConfig): Array<string> => {
  const widgets = config.controllers.flatMap((controller) =>
    Option.match(ControllerDevices.findByName(controller.device), {
      onSome: (device) => device.widgets.resolve(controller.config),
      onNone: () => [],
    })
  )
  return Set(widgets.flatMap((widget) => widget.tracks())).toArray()
}

const init = (
  dawListener: EventEmitter<MidiEventRecord>,
  dawEmitter: EventEmitter<MidiEventRecord>
) => {
  log.info('Project Main')
  ProjectState.project.config.sub((projects) => {
    const activeProject = getActiveProjectConfig(projects)
    log.info('Active project', activeProject)
    if (activeProject.key !== 'reload-project') {
      const tracks = getTracks(activeProject)
      return handshake(dawEmitter, tracks)
    }
  })
  listener(dawListener)
}

export const ProjectMain = {
  init,
}
