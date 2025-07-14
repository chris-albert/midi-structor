import { Option, pipe } from 'effect'
import ControllerWorkerMain from './ControllerWorkerMain?worker'
import { log } from '../../logger/log'
import { ProjectState } from '../../state/ProjectState'
import { ProjectsConfig, ProjectConfig } from '../../project/ProjectConfig'
import _ from 'lodash'
import { ConfiguredController } from '../../controllers/ConfiguredController'
import { MidiDeviceManager } from '../../midi/MidiDeviceManager'
import { MidiListener } from '../../midi/MidiListener'
import { MidiEmitter } from '../../midi/MidiEmitter'
import { ControllerUIDevices } from '../../controllers/devices/ui/ControllerUIDevices'
import { EventEmitterWithBroadcast, EventRecord } from '../../EventEmitter'

type ReloadControllerWorker = {
  type: 'RELOAD_CONTROLLERS'
}

type ControllerWorkerMessage = ReloadControllerWorker

const ControllerChannel = () =>
  EventEmitterWithBroadcast<EventRecord<ControllerWorkerMessage>>(
    'controller:worker'
  )

const createWorker = (
  project: ProjectConfig,
  controller: ConfiguredController,
  manager: MidiDeviceManager
) => {
  const name = `controller:${project.key}:${controller.name}`
  const worker = new ControllerWorkerMain({ name })
  log.info('Creating controller worker', name)
  worker.postMessage(['INIT', controller])

  // Wire up listener
  const listener = Option.getOrElse(
    pipe(controller.selected.input, Option.flatMap(manager.getInput)),
    () => MidiListener.empty()
  )

  listener.on('*', (m) => worker.postMessage(['EMITTER', m]))

  // Wire up emitter
  const emitter = Option.getOrElse(
    pipe(controller.selected.output, Option.flatMap(manager.getOutput)),
    () => MidiEmitter.empty()
  )

  worker.onmessage = (message) => {
    if (_.isArray(message.data) && message.data.length == 2) {
      const [messageType, messageData] = message.data
      if (messageType === 'LISTENER') {
        emitter.send(messageData)
      }
    }
  }

  return worker
}

const setupVirtualController = (controller: ConfiguredController) => {
  const emitter = ConfiguredController.virtualEmitter(controller).listener
  const putStore = ControllerUIDevices.get()
    .getByName(controller.device)
    .uiStore(controller.id)
    .put()
  emitter.on('*', putStore)
}

const setupVirtualControllers = (project: ProjectConfig) => {
  _.forEach(project.controllers, setupVirtualController)
}

const loadProject = (project: ProjectConfig): (() => void) => {
  const manager = MidiDeviceManager.state.get()
  log.info('Loading Controllers for project', project)

  const controllerWorkers = _.map(project.controllers, (controller) =>
    createWorker(project, controller, manager)
  )

  setupVirtualControllers(project)

  return () => {
    log.info('Cleaning up Controllers for project', project)
    controllerWorkers.map((w) => w.terminate())
  }
}

let isInit = false
const init = () => {
  if (!isInit) {
    ProjectState.project.config.subAndInit((projects) =>
      Option.match(ProjectsConfig.getActive(projects), {
        onSome: (activeProject) => loadProject(activeProject),
        onNone: () => {
          log.error('No active project found', projects)
          return () => {}
        },
      })
    )
    ControllerChannel().listener.on('RELOAD_CONTROLLERS', () => {
      ProjectState.project.config.set((s) => _.cloneDeep(s))
    })
    isInit = true
  }
}

const sendReloadRequest = () => {
  log.info('Sending reload request...')
  ControllerChannel().emitter.emit({ type: 'RELOAD_CONTROLLERS' })
}

export const ControllerWorker = {
  init,
  sendReloadRequest,
}
