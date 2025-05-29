import { ResolvedControllerWidget } from './ControllerWidget'
import { MidiMessage } from '../midi/MidiMessage'
import { Controller, TargetColor } from './Controller'
import { MidiEmitter, MidiListener } from '../midi/GlobalMidi'
import { Color } from './Color'
import { ConfiguredController } from './ConfiguredController'
import hash from 'object-hash'

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
  controller: Controller,
  emitter: MidiEmitter,
  listener: MidiListener
): ControllerInstance => {
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
      controller.init(emitter)(widgets)
      cleanupLoading = controller.loading(emitter)(controller)
      initCalled = true
    }
  }

  const loaded = () => {
    cleanupLoading()
  }

  const on = (f: (m: MidiMessage) => void) => {
    cleanupListener = listener.on('*', (m) => {
      if (controller.listenFilter(m)) {
        f(m)
      }
    })
  }

  const off = () => {
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
    console.log('Creating controller instance', configuredController.name)
    const instance = create(controller, emitter, listener)
    CONTROLLER_INSTANCES[key] = { configHash, instance }
    return instance
  }
}

export const ControllerInstance = {
  of,
}
