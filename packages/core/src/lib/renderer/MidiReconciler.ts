import Reconciler, { OpaqueHandle } from 'react-reconciler'
import ReactReconciler from 'react-reconciler'
import _ from 'lodash'
import { MidiTarget } from '../midi/MidiTarget'
import { messageToKey } from '../controllers/Controller'
import { ControllerInstance as ControllerModel } from '../controllers/ControllerInstance'
import { Color } from '../controllers/Color'
import { MidiMessage } from '../midi/MidiMessage'
import React from 'react'

const SHOW_VERBOSE_LOGS = false

const log = SHOW_VERBOSE_LOGS ? console.log : () => {}

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace JSX {
    interface IntrinsicElements {
      pad: PadProps
      controller: ControllerProps
    }
  }
}

export type PadProps = {
  color: Color
  target: MidiTarget
  onClick?: () => void
  key?: string
  options?: any
}

type ControllerProps = {
  children?: Array<Pad | React.ReactElement | undefined> | Pad
  model: ControllerModel
  name: string
  enabled?: boolean
}

type Pad = {
  type: 'pad'
  props: PadProps
  controller?: Controller
}

type Controller = {
  type: 'controller'
  props: ControllerProps
  manager: ControllerManager
  listener: ListenersManager
}

type Type = 'pad' | 'controller'
type Props = PadProps | ControllerProps
type Container = {
  controllers: Array<Controller>
}

type Instance = Pad | Controller

type TextInstance = never
type ChildSet = unknown
type PublicInstance = unknown
type HostContext = {}
type TimeoutHandle = unknown
type UpdatePayload = Instance
type SuspenseInstance = never

type ControllerManager = {
  remove: () => void
  render: (pads: Array<PadProps>) => void
}

const ControllerManager = (
  controller: ControllerModel,
  listenersManager: ListenersManager
): ControllerManager => {
  controller.clear()
  controller.on(listenersManager.on)

  return {
    remove() {
      controller.clear()
      controller.off()
    },
    render(pads: Array<PadProps>) {
      controller.render(pads)
    },
  }
}

const commit = (instance: Instance, props: Props) => {
  if (instance.type === 'pad') {
    const padProps = props as PadProps
    instance.controller?.manager.render([padProps])
    if (instance.controller !== undefined && padProps.onClick !== undefined) {
      instance.controller.listener.add(padProps.target, padProps.onClick)
    }
  } else if (instance.type === 'controller') {
  }
}

const initInstance = (type: Type, props: Props): Instance => {
  if (type === 'pad') {
    return {
      type: 'pad',
      props: props as PadProps,
      controller: undefined,
    }
  } else if (type === 'controller') {
    const controllerProps = props as ControllerProps
    const listener = ListenersManager()
    return {
      type: 'controller',
      props: controllerProps,
      manager: ControllerManager(controllerProps.model, listener),
      listener,
    }
  } else {
    throw new Error(`Invalid React MIDI node ${type}`)
  }
}

const appendPad = (controller: Controller, pad: Pad) => {
  pad.controller = controller
}

type ListenersManager = {
  add: (target: MidiTarget, f: () => void) => void
  on: (message: MidiMessage) => void
}

const ListenersManager = (): ListenersManager => {
  const listeners: Record<string, () => void> = {}

  return {
    add(target: MidiTarget, f: () => void) {
      const key = MidiTarget.toKey(target)
      listeners[key] = f
    },
    on(message: MidiMessage) {
      const key = messageToKey(message)
      const list = listeners[key]
      if (list !== undefined) {
        list()
      }
    },
  }
}

const instance = Reconciler({
  createInstance(
    type: Type,
    props: Props,
    rootContainer: Container,
    hostContext: HostContext,
    internalHandle: ReactReconciler.OpaqueHandle
  ): Instance {
    log('createInstance', type, props, rootContainer, hostContext)
    const instance = initInstance(type, props)
    return instance
  },

  removeChildFromContainer(
    container: Container,
    child: Instance | TextInstance | SuspenseInstance
  ): void {
    log('removeChildFromContainer', container, child)
    if (child.type === 'controller') {
      child.manager.remove()
    }
  },

  appendInitialChild(
    parentInstance: Instance,
    child: Instance | TextInstance
  ): void {
    log('appendInitialChild', parentInstance, child)
    if (parentInstance.type === 'controller' && child.type === 'pad') {
      appendPad(parentInstance, child)
    }
  },

  appendChild(parentInstance: Instance, child: Instance | TextInstance): void {
    log('appendChild', parentInstance, child)
  },

  prepareUpdate(
    instance: Instance,
    type: Type,
    oldProps: Props,
    newProps: Props,
    rootContainer: Container,
    hostContext: HostContext
  ): UpdatePayload | null {
    log(
      'prepareUpdate',
      instance,
      type,
      oldProps,
      newProps,
      rootContainer,
      hostContext
    )
    if (!_.isEqual(oldProps, newProps)) {
      return instance
    } else {
      return null
    }
  },

  commitUpdate(
    instance: Instance,
    updatePayload: UpdatePayload,
    type: Type,
    prevProps: Props,
    nextProps: Props,
    internalHandle: OpaqueHandle
  ): void {
    log('commitUpdate', instance, updatePayload, type, prevProps, nextProps)
    commit(updatePayload, nextProps)
  },

  commitMount(
    instance: Instance,
    type: Type,
    props: Props,
    internalInstanceHandle: OpaqueHandle
  ): void {
    log('commitMount', instance, type, props)
    commit(instance, props)
  },

  appendChildToContainer(
    container: Container,
    child: Instance | TextInstance
  ): void {
    log('appendChildToContainer', container, child)
    if (child.type === 'controller') {
      // container.controllers.push(child)
    }
  },

  insertBefore(
    parentInstance: Instance,
    child: Instance | TextInstance,
    beforeChild: Instance | TextInstance | SuspenseInstance
  ): void {
    log('insertBefore', parentInstance, child, beforeChild)
    if (parentInstance.type === 'controller' && child.type === 'pad') {
      appendPad(parentInstance, child)
    }
  },

  insertInContainerBefore(
    container: Container,
    child: Instance | TextInstance,
    beforeChild: Instance | TextInstance | SuspenseInstance
  ): void {},

  /**
   * No use under here
   */

  getRootHostContext(rootContainer: Container): HostContext | null {
    log('getRootHostContext', rootContainer)

    return {}
  },

  getChildHostContext(
    parentHostContext: HostContext,
    type: Type,
    rootContainer: Container
  ): HostContext {
    log('getChildHostContext', parentHostContext, type, rootContainer)
    return parentHostContext
  },

  createTextInstance(
    text: string,
    rootContainer: Container,
    hostContext: HostContext,
    internalHandle: ReactReconciler.OpaqueHandle
  ): TextInstance {
    throw new Error('ReactMidi does not support text instances.')
  },

  finalizeContainerChildren(container: Container, newChildren: ChildSet): void {
    log('finalizeContainerChildren')
  },

  appendChildToContainerChildSet(
    childSet: ChildSet,
    child: Instance | TextInstance
  ): void {
    log('appendChildToContainerChildSet', childSet, child)
  },

  finalizeInitialChildren(
    instance: Instance,
    type: Type,
    props: Props,
    rootContainer: Container,
    hostContext: HostContext
  ): boolean {
    log(
      'finalizeInitialChildren',
      instance,
      type,
      props,
      rootContainer,
      hostContext
    )
    return true
  },

  removeChild(
    parentInstance: Instance,
    child: Instance | TextInstance | SuspenseInstance
  ): void {
    log('removeChild', parentInstance, child)
  },

  /**
   * Stuff below here we don't need to worry about
   */
  cancelTimeout(id: TimeoutHandle): void {},

  detachDeletedInstance(node: Instance): void {},
  getInstanceFromScope(scopeInstance: any): null | Instance {
    return null
  },
  getPublicInstance(instance: Instance | TextInstance): PublicInstance {
    log('getPublicInstance')
    return undefined
  },

  isPrimaryRenderer: false,
  noTimeout: undefined,
  prepareForCommit(containerInfo: Container): Record<string, any> | null {
    log('prepareForCommit', containerInfo)
    return null
  },
  preparePortalMount(containerInfo: Container): void {
    log('preparePortalMount', containerInfo)
  },

  resetAfterCommit(containerInfo: Container): void {
    log('resetAfterCommit', containerInfo)
  },
  scheduleTimeout(
    fn: (...args: unknown[]) => unknown,
    delay: number | undefined
  ): TimeoutHandle {
    return undefined
  },
  shouldSetTextContent(type: Type, props: Props): boolean {
    return false
  },
  supportsHydration: false,
  supportsMutation: true,
  supportsPersistence: false,
  afterActiveInstanceBlur(): void {},
  beforeActiveInstanceBlur(): void {},
  getCurrentEventPriority(): ReactReconciler.Lane {
    // @ts-ignore
    return undefined
  },
  getInstanceFromNode(node: any): ReactReconciler.Fiber | null | undefined {
    return undefined
  },
  prepareScopeUpdate(scopeInstance: any, instance: any): void {},
  clearContainer(container: Container): void {},
})

export const MidiReconciler = {
  instance,
}
