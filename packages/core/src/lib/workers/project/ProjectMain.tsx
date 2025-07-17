import { EventEmitter } from '../../EventEmitter'
import { MidiEventRecord } from '../../midi/MidiDevice'
import {
  AbletonUIMessage,
  parseAbletonUIMessage,
  TX_MESSAGE,
} from '../../project/AbletonUIMessage'
import { ProjectConfig, ProjectsConfig } from '../../project/ProjectConfig'
import {
  arrangementMessageCount,
  InitArrangement,
  initDone,
} from '../../project/UIStateDisplay'
import { ProjectState } from '../../state/ProjectState'
import { Option, Queue, Effect, Schedule } from 'effect'
import { ControllerDevices } from '../../controllers/devices/ControllerDevices'
import { Set } from 'immutable'
import { log } from '../../logger/log'
import { DawMidi } from '../../midi/DawMidi'
import { MidiMessage, SysExMessage } from '../../midi/MidiMessage'
import _ from 'lodash'

let initArrangement: InitArrangement = []

const listenerQueue = Effect.runSync(Queue.unbounded<SysExMessage>())

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
      ProjectState.importMessageCount.set(msg.messageCount)
      initArrangement = []
    } else if (msg.type === 'init-track') {
      initArrangement.push(msg)
    } else if (msg.type === 'init-clip') {
      initArrangement.push(msg)
    } else if (msg.type === 'init-cue') {
      initArrangement.push(msg)
    } else if (msg.type === 'init-done') {
      ProjectState.importStatus.set({ type: 'finalizing' })
      const arrangement = initDone(initArrangement)
      const sourceMessageCount = ProjectState.importMessageCount.get()
      const parsedMessageCount = arrangementMessageCount(arrangement)
      ProjectState.project.arrangement.set(arrangement)
      const status = {
        type: 'done' as const,
        sourceMessageCount,
        parsedMessageCount,
      }
      log.info('Import Status', status)
      ProjectState.importStatus.set(status)
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
    } else if (msg.type === 'tick') {
      ProjectState.realTime.tick.set(msg)
    }
  }

  dawListener.on('sysex', (sysex) => {
    Effect.runSync(Queue.offer(listenerQueue, sysex))
  })

  const processQueue = Effect.map(Queue.take(listenerQueue), (sysex) => {
    const msg = parseAbletonUIMessage(sysex)
    if (msg !== undefined) {
      onAbletonUIMessage(msg)
    }
  })
  Effect.runPromise(Effect.repeat(processQueue, Schedule.repeatForever))
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

const getTracks = (config: ProjectConfig): Array<string> => {
  const widgets = config.controllers.flatMap((controller) =>
    Option.match(ControllerDevices.findByName(controller.device), {
      onSome: (device) => device.widgets.resolve(controller.config),
      onNone: () => [],
    })
  )
  return Set(widgets.flatMap((widget) => widget.tracks())).toArray()
}

let HANDSHAKE_CLEANUP: (() => void) | void | undefined = undefined
let TRACKS: Array<string> = []

const setupProject = (
  project: ProjectConfig,
  dawEmitter: EventEmitter<MidiEventRecord>
) => {
  const tracks = getTracks(project)
  if (!_.isEqual(TRACKS, tracks)) {
    log.info('Tracks were not equal, reloading project...')
    TRACKS = tracks
    HANDSHAKE_CLEANUP = handshake(dawEmitter, tracks)
  } else {
    log.info('Tracks were the same, doing nothing here...')
  }
  return HANDSHAKE_CLEANUP
}

const init = (
  dawListener: EventEmitter<MidiEventRecord>,
  dawEmitter: EventEmitter<MidiEventRecord>
) => {
  log.info('Project Main')
  ProjectState.project.config.sub((projects) =>
    Option.match(ProjectsConfig.getActive(projects), {
      onSome: (activeProject) => {
        log.info('Active project', activeProject)
        return setupProject(activeProject, dawEmitter)
      },
      onNone: () => {
        log.error('No active project found', projects)
        return () => {}
      },
    })
  )
  DawMidi.getChannel().onmessage = (message) => {
    dawEmitter.emit(message.data as MidiMessage)
  }
  listener(dawListener)
}

export const ProjectMain = {
  init,
}
