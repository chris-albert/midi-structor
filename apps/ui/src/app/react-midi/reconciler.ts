import ReactReconciler, { OpaqueHandle } from 'react-reconciler'
import _ from 'lodash'
import { Controller as ControllerModel } from '../model/controllers/Controller'
import { MidiTarget } from '../midi/MidiTarget'
import { MidiInput, MidiMessage, MidiOutput } from '@midi-structor/core'

/**
 * <midi-universe>
 *    <midi-device input={} output={}>
 *        <midi-input target={} on={} />
 *        <midi-output target={} value={} />
 *    </midi-device>
 * </midi-universe>
 */

const log = true ? console.log : () => {}

declare global {
  namespace JSX {
    interface IntrinsicElements {
      'midi-input': MidiInputProps
      'midi-output': MidiOutputProps
      'midi-device': MidiDeviceProps
      'midi-universe': MidiUniverseProps
    }
  }
}

type MidiInputProps = {
  target: MidiTarget
  on: (message: MidiMessage) => void
  key?: string
}

type MidiOutputProps = {
  target: MidiTarget
  value: number
  key?: string
}

type MidiDeviceProps = {
  name: string
  input: MidiInput
  output: MidiOutput
  children: Array<MidiInputInstance | MidiOutputInstance | null> | null
  key?: string
}

type MidiUniverseProps = {
  children: Array<MidiDeviceInstance> | MidiDeviceInstance | null
}

type MidiInputInstance = {
  type: 'midi-input'
  props: MidiInputProps
}

type MidiOutputInstance = {
  type: 'midi-output'
  props: MidiOutputProps
}

type MidiDeviceInstance = {
  type: 'midi-device'
  props: MidiDeviceProps
}

type MidiUniverseInstance = {
  type: 'midi-universe'
  props: MidiUniverseProps
}

type Instance = MidiInputInstance | MidiOutputInstance | MidiDeviceInstance | MidiUniverseInstance
type Type = Instance['type']
type Props = Instance['props']
type Container = {
  root: MidiUniverseInstance | undefined
}
type HostContext = {
  model: ControllerModel | undefined
}

type TextInstance = never
type ChildSet = unknown
type PublicInstance = unknown
type TimeoutHandle = unknown
type UpdatePayload = Instance
type SuspenseInstance = unknown

const commit = (instance: Instance) => {}

const typeInstance = (type: Type, props: Props): Instance => {
  if (type === 'midi-input') {
    return { type, props: props as MidiInputProps }
  } else if (type === 'midi-output') {
    return { type, props: props as MidiOutputProps }
  } else if (type === 'midi-device') {
    return { type, props: props as MidiDeviceProps }
  } else if (type === 'midi-universe') {
    return { type, props: props as MidiUniverseProps }
  } else {
    throw new Error(`Invalid react-midi node ${type}`)
  }
}

const instance = ReactReconciler({
  createInstance(
    type: Type,
    props: Props,
    rootContainer: Container,
    hostContext: HostContext,
    internalHandle: ReactReconciler.OpaqueHandle,
  ): Instance {
    log('createInstance', type, props, rootContainer, hostContext, internalHandle)
    const instance = typeInstance(type, props)
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
    if (child.type === 'midi-universe') {
      container.root = child
    }
  },

  appendChildToContainerChildSet(childSet: ChildSet, child: Instance | TextInstance): void {
    log('appendChildToContainerChildSet', childSet, child)
  },

  appendInitialChild(parentInstance: Instance, child: Instance | TextInstance): void {
    log('appendInitialChild', parentInstance, child)
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
    return null
  },
  isPrimaryRenderer: false,
  noTimeout: undefined,
  prepareForCommit(containerInfo: Container): Record<string, any> | null {
    return null
  },
  preparePortalMount(containerInfo: Container): void {},

  resetAfterCommit(containerInfo: Container): void {},
  scheduleTimeout(fn: (...args: unknown[]) => unknown, delay: number | undefined): TimeoutHandle {
    return undefined
  },
  shouldSetTextContent(type: Type, props: Props): boolean {
    return false
  },
  supportsHydration: true,
  supportsMutation: true,
  supportsPersistence: true,
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

export const Reconciler = {
  instance,
}
