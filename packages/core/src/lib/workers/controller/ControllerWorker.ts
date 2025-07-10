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

const createWorker = (
  project: ProjectConfig,
  controller: ConfiguredController,
  manager: MidiDeviceManager
) => {
  const worker = new ControllerWorkerMain({
    name: `controller:${project.key}:${controller.name}`,
  })
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

const loadProject = (project: ProjectConfig): (() => void) => {
  const manager = MidiDeviceManager.state.get()
  log.info('Loading Controllers for project', project)

  const controllerWorkers = _.map(project.controllers, (controller) =>
    createWorker(project, controller, manager)
  )

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
    isInit = true
  }
}

export const ControllerWorker = {
  init,
}
