import { ResolvedControllerWidget } from './ControllerWidget'
import { MidiMessage } from '../midi/MidiMessage'
import { Controller, TargetColor } from './Controller'
import { Color } from './Color'
import { ConfiguredController } from './ConfiguredController'
import hash from 'object-hash'
import { MidiEmitter } from '../midi/MidiEmitter'
import { MidiListener } from '../midi/MidiListener'

export type ControllerInstance = {
  underlying: Controller
  init: (w: Array<ResolvedControllerWidget>) => void
  render: (p: Array<TargetColor>) => void
  clear: () => void
  loaded: () => void
  on: (f: (m: MidiMessage) => void) => void
  off: () => void
}

const create = (
  name: string,
  controller: Controller,
  emitter: MidiEmitter,
  listener: MidiListener
): ControllerInstance => {
  // console.log('controller.create', name)
  let cleanupListener = () => {}
  let cleanupLoading = () => {}
  let initCalled = false

  const render = controller.render(emitter)

  const clear = () => {
    render(
      controller.targets.map((target) => ({
        target,
        color: Color.BLACK,
      }))
    )
  }

  const init = (widgets: Array<ResolvedControllerWidget>) => {
    if (!initCalled) {
      // console.log('controller.init', name)
      controller.init(emitter)(widgets)
      cleanupLoading = controller.loading(emitter)(controller)
      initCalled = true
    }
  }

  const loaded = () => {
    // console.log('controller.loaded', name)
    cleanupLoading()
  }

  const on = (f: (m: MidiMessage) => void) => {
    // console.log('controller.on', name)
    cleanupListener = listener.on('*', (m) => {
      if (controller.listenFilter(m)) {
        f(m)
      }
    })
  }

  const off = () => {
    // console.log('controller.off', name)
    cleanupListener()
  }

  return {
    underlying: controller,
    init,
    render,
    clear,
    loaded,
    on,
    off,
  }
}

const CONTROLLER_INSTANCES: Record<
  string,
  { configHash: string; instance: ControllerInstance }
> = {}

const of = (
  configuredController: ConfiguredController,
  controller: Controller,
  emitter: MidiEmitter,
  listener: MidiListener
): ControllerInstance => {
  const key = `${configuredController.name}:${configuredController.id}`
  const configHash = hash(configuredController.config)
  const maybeInstance = CONTROLLER_INSTANCES[key]
  if (maybeInstance !== undefined && maybeInstance.configHash == configHash) {
    return maybeInstance.instance
  } else {
    const instance = create(key, controller, emitter, listener)
    CONTROLLER_INSTANCES[key] = { configHash, instance }
    return instance
  }
}

export const ControllerInstance = {
  of,
}
