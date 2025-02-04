import Reconciler, { OpaqueHandle } from 'react-reconciler'
import ReactReconciler from 'react-reconciler'
import _ from 'lodash'
import { MidiTarget } from '../midi/MidiTarget'
import { Controller as ControllerModel, emptyController, messageToKey } from '../controllers/Controller'
import { Color } from '../controllers/Color'
import { MidiMessage } from '../midi/MidiMessage'

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
}

type ControllerProps = {
  children: Array<Pad> | Pad | null
  model: ControllerModel
}

type Pad = {
  type: 'pad'
  props: PadProps
}

type Controller = {
  type: 'controller'
  props: ControllerProps
  pads: Record<string, PadProps>
}

type Type = 'pad' | 'controller'
type Props = PadProps | ControllerProps
type Container = {
  root: Controller | undefined
}

type Instance = Pad | Controller

type TextInstance = never
type ChildSet = unknown
type PublicInstance = unknown
type HostContext = {
  model: ControllerModel | undefined
}
type TimeoutHandle = unknown
type UpdatePayload = Instance
type SuspenseInstance = unknown

const GlobalControllerManager = () => {
  let controller: ControllerModel = emptyController

  return {
    get() {
      return controller
    },
    set(c: ControllerModel) {
      controller = c
      controller.init()
      controller.clear()
    },
  }
}

const GlobalController = GlobalControllerManager()

const commit = (instance: Instance) => {
  if (instance.type === 'pad') {
    GlobalController.get().render([instance.props])
  } else if (instance.type === 'controller') {
  }
}

const typeInstance = (type: Type, props: Props): Instance => {
  if (type === 'pad') {
    return {
      type: 'pad',
      props: props as PadProps,
    }
  } else if (type === 'controller') {
    return {
      type: 'controller',
      props: props as ControllerProps,
      pads: {},
    }
  } else {
    throw new Error(`Invalid React MIDI node ${type}`)
  }
}

const ListenersManager = () => {
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

const Listeners = ListenersManager()

const initInstance = (instance: Instance) => {
  if (instance.type === 'controller') {
    GlobalController.set(instance.props.model)
    GlobalController.get().on(Listeners.on)
  } else if (instance.type === 'pad') {
    if (instance.props.onClick !== undefined) {
      Listeners.add(instance.props.target, instance.props.onClick)
    }
  }
}

const addInstance = (parentInstance: Instance, child: Instance) => {
  if (parentInstance.type === 'controller' && child.type === 'pad') {
    parentInstance.pads[MidiTarget.toKey(child.props.target)] = child.props
  }
}

const instance = Reconciler({
  createInstance(
    type: Type,
    props: Props,
    rootContainer: Container,
    hostContext: HostContext,
    internalHandle: ReactReconciler.OpaqueHandle,
  ): Instance {
    log('createInstance', type, props, rootContainer, hostContext, internalHandle)
    const instance = typeInstance(type, props)
    initInstance(instance)
    return instance
  },

  createTextInstance(
    text: string,
    rootContainer: Container,
    hostContext: HostContext,
    internalHandle: ReactReconciler.OpaqueHandle,
  ): TextInstance {
    throw new Error('ReactMidi does not support text instances.')
  },

  appendChild(parentInstance: Instance, child: Instance | TextInstance): void {
    log('appendChild', parentInstance, child)
  },

  appendChildToContainer(container: Container, child: Instance | TextInstance): void {
    log('appendChildToContainer', container, child)
    if (child.type === 'controller') {
      container.root = child
    }
  },

  appendChildToContainerChildSet(childSet: ChildSet, child: Instance | TextInstance): void {
    log('appendChildToContainerChildSet', childSet, child)
  },

  appendInitialChild(parentInstance: Instance, child: Instance | TextInstance): void {
    log('appendInitialChild', parentInstance, child)
    // addInstance(parentInstance, child)
  },

  getChildHostContext(parentHostContext: HostContext, type: Type, rootContainer: Container): HostContext {
    log('getChildHostContext', parentHostContext, type, rootContainer)
    return parentHostContext
  },

  finalizeContainerChildren(container: Container, newChildren: ChildSet): void {
    log('finalizeContainerChildren')
  },

  finalizeInitialChildren(
    instance: Instance,
    type: Type,
    props: Props,
    rootContainer: Container,
    hostContext: HostContext,
  ): boolean {
    log('finalizeInitialChildren', instance, type, props, rootContainer, hostContext)
    return true
  },

  prepareUpdate(
    instance: Instance,
    type: Type,
    oldProps: Props,
    newProps: Props,
    rootContainer: Container,
    hostContext: HostContext,
  ): UpdatePayload | null {
    log('prepareUpdate', instance, type, oldProps, newProps, rootContainer, hostContext)
    if (!_.isEqual(oldProps, newProps)) {
      return typeInstance(type, newProps)
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
    internalHandle: OpaqueHandle,
  ): void {
    log('commitUpdate', instance, updatePayload, type, prevProps, nextProps)
    commit(updatePayload)
  },

  commitMount(instance: Instance, type: Type, props: Props, internalInstanceHandle: OpaqueHandle): void {
    log('commitMount', instance, type, props)
    commit(instance)
  },

  removeChild(parentInstance: Instance, child: Instance | TextInstance | SuspenseInstance): void {
    log('removeChild', parentInstance, child)
  },

  insertBefore(
    parentInstance: Instance,
    child: Instance | TextInstance,
    beforeChild: Instance | TextInstance | SuspenseInstance,
  ): void {
    log('insertBefore', parentInstance, child, beforeChild)
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
  getRootHostContext(rootContainer: Container): HostContext | null {
    if (rootContainer.root !== undefined) {
      return { model: rootContainer.root.props.model }
    } else {
      return null
    }
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
  scheduleTimeout(fn: (...args: unknown[]) => unknown, delay: number | undefined): TimeoutHandle {
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
  removeChildFromContainer(container: Container, child: Instance | TextInstance | SuspenseInstance): void {},
})

export const MidiReconciler = {
  instance,
}
