import { EventEmitter } from '../../EventEmitter'
import { MidiEventRecord } from '../../midi/MidiDevice'
import {
  AbletonUIMessage,
  InitClipMessage,
  InitCueMessage,
  InitTrackMessage,
  parseAbletonUIMessage,
  TX_MESSAGE,
} from '../../project/AbletonUIMessage'
import { ProjectConfig, ProjectsConfig } from '../../project/ProjectConfig'
import {
  arrangementMessageCount,
  buildInitArrangement,
  InitArrangement,
  initDone,
} from '../../project/UIStateDisplay'
import { ProjectState } from '../../state/ProjectState'
import { Option, Queue, Effect, Schedule, Schema } from 'effect'
import { ControllerDevices } from '../../controllers/devices/ControllerDevices'
import { Set } from 'immutable'
import { log } from '../../logger/log'
import { DawMidi } from '../../midi/DawMidi'
import { MidiMessage, SysExMessage } from '../../midi/MidiMessage'
import _ from 'lodash'
import { SchemaHelper } from '../../util/SchemaHelper'

const MAX_RESEND_ATTEMPTS = 5
const USE_MIDI_QUEUE = false

let resendAttempts = 0

const PROJECT_CHANNEL = new BroadcastChannel('global-project')

const determineMissingMessages = (
  messages: InitArrangement,
  expectedMessageCount: number
): Array<number> => {
  const messageIdLookup = _.keyBy(messages, 'messageId')
  const missingMessageIds: Array<number> = []
  Array.from({ length: expectedMessageCount - 1 }).forEach((a, index) => {
    if (_.get(messageIdLookup, index, undefined) === undefined) {
      missingMessageIds.push(index)
    }
  })
  log.info('Missing message ids', missingMessageIds)
  return missingMessageIds
}

let initArrangement: InitArrangement = []

const listenerQueue = Effect.runSync(Queue.unbounded<SysExMessage>())

const processFullProject = (event: MessageEvent<any>) => {
  const [initArrangement, count] = buildInitArrangement(event.data)
  finalizeInitArrangement(initArrangement, count)
}

const finalizeInitArrangement = (
  initArrangement: InitArrangement,
  sourceMessageCount: number
) => {
  const arrangement = initDone(initArrangement)
  const parsedMessageCount = arrangementMessageCount(arrangement)
  ProjectState.project.arrangement.set(arrangement)
  const status = {
    type: 'done' as const,
    sourceMessageCount,
    parsedMessageCount,
  }
  log.info('Import Status', status)
  ProjectState.importStatus.set(status)
}

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
      const sourceMessageCount = ProjectState.importMessageCount.get()
      const missingMessageIds = determineMissingMessages(
        initArrangement,
        sourceMessageCount
      )
      if (resendAttempts >= MAX_RESEND_ATTEMPTS) {
        ProjectState.importStatus.set({
          type: 'error',
          msg: `Resend attempts exceeded ${MAX_RESEND_ATTEMPTS}!`,
        })
      } else if (_.isEmpty(missingMessageIds)) {
        finalizeInitArrangement(initArrangement, sourceMessageCount)
      } else {
        resendAttempts++
        ProjectState.importStatus.set({
          type: 'resend',
          missingMessageIds,
        })
      }
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
      ProjectState.realTime.tick.set(msg.tick)
    }
  }

  const processSysex = (sysex: SysExMessage) => {
    const msg = parseAbletonUIMessage(sysex)
    if (msg !== undefined) {
      onAbletonUIMessage(msg)
    }
  }

  PROJECT_CHANNEL.onmessage = processFullProject

  dawListener.on('sysex', (sysex) => {
    if (USE_MIDI_QUEUE) {
      Effect.runSync(Queue.offer(listenerQueue, sysex))
    } else {
      processSysex(sysex)
      // log.timed(log.info, () => processSysex(sysex))('info')
    }
  })

  if (USE_MIDI_QUEUE) {
    const processQueue = Effect.map(Queue.take(listenerQueue), (sysex) => {
      processSysex(sysex)
    })
    Effect.runPromise(Effect.repeat(processQueue, Schedule.repeatForever))
  }
}

const handshakeOverMIDI = (
  dawEmitter: EventEmitter<MidiEventRecord>,
  tracks: Array<string>
) => {
  log.info('Starting Handshake over MIDI')
  dawEmitter.emit(TX_MESSAGE.init())

  return ProjectState.importStatus.sub((importStatus) => {
    if (importStatus.type === 'ack') {
      dawEmitter.emit(TX_MESSAGE.initReady(tracks))
    } else if (importStatus.type === 'resend') {
      dawEmitter.emit(TX_MESSAGE.resend(importStatus.missingMessageIds))
    }
  })
}

const handshakeOverUDP = (
  dawEmitter: EventEmitter<MidiEventRecord>,
  tracks: Array<string>
) => {
  log.info('Starting Handshake over UDP')
}

const USE_MIDI_HANDSHAKE = true

const handshake = (
  dawEmitter: EventEmitter<MidiEventRecord>,
  tracks: Array<string>
) =>
  USE_MIDI_HANDSHAKE
    ? handshakeOverMIDI(dawEmitter, tracks)
    : handshakeOverUDP(dawEmitter, tracks)

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
