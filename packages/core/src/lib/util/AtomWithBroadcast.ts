import { atom, PrimitiveAtom, SetStateAction, getDefaultStore } from 'jotai'
import { AtomStorage } from '../storage/AtomStorage'
import { v4 } from 'uuid'
import { ProcessManager, ProcessType } from '../ProcessManager'
import { log, LogFn } from '../logger/log'

const stateType = ProcessManager.getType()

const SHOULD_LOG = true

// const log = (key: string, id: string, msg: string, rest: any = null) => {
//   if (SHOULD_LOG && key === 'projects-config') {
//     // console.log(`--${stateType}:${key} - ${msg}`, rest)
//     newLog.info(`${key} - ${msg}`, rest)
//   }
// }

const store = getDefaultStore()

type Update<A> = {
  type: 'update'
  value: A
}

type Init = {
  type: 'init'
  id: string
}

type InitAck<A> = {
  type: 'init-ack'
  id: string
  value: A
}

type Event<A> = Update<A> | Init | InitAck<A>

export function atomWithBroadcastVanilla<Value>(
  key: string,
  initialValue: Value
) {
  const baseAtom = atom(initialValue)
  const listeners = new Set<(event: MessageEvent<any>) => void>()
  const channel = new BroadcastChannel(key)

  channel.onmessage = (event) => {
    listeners.forEach((l) => l(event))
  }

  const broadcastAtom = atom(
    (get) => get(baseAtom),
    (get, set, update: { isEvent: boolean; value: SetStateAction<Value> }) => {
      set(baseAtom, update.value)
      if (!update.isEvent) {
        channel.postMessage(get(baseAtom))
      }
    }
  )

  broadcastAtom.onMount = (setAtom) => {
    const listener = (event: MessageEvent<any>) => {
      setAtom({ isEvent: true, value: event.data })
    }

    listeners.add(listener)

    return () => {
      listeners.delete(listener)
    }
  }

  const returnedAtom = atom(
    (get) => get(broadcastAtom),
    (_get, set, update: SetStateAction<Value>) => {
      set(broadcastAtom, { isEvent: false, value: update })
    }
  )

  return returnedAtom
}

const IS_WEB_WORKER = typeof window === 'undefined'

export const atomWithBroadcast = <Value>(
  owner: ProcessType,
  key: string,
  initialValue: Value,
  type: 'mem' | 'storage' = 'mem'
): PrimitiveAtom<Value> => {
  const isMem = type === 'mem'
  const baseAtom =
    !isMem && !IS_WEB_WORKER
      ? AtomStorage.atom(key, initialValue)
      : atom(initialValue)
  const listeners = new Set<(event: MessageEvent<Event<Value>>) => void>()
  const channel = new BroadcastChannel(key)
  const id = v4()

  const debug = log.enabled(key === 'projects-config', log.info)

  debug('Creating', { owner, key, id })

  let last: Value | undefined = undefined

  const fireAllListeners = (event: MessageEvent<Event<Value>>) => {
    listeners.forEach((l) => l(event))
  }

  channel.onmessage = (e) => {
    const event = e as MessageEvent<Event<Value>>
    if (event.data.type === 'update') {
      fireAllListeners(event)
    } else if (event.data.type === 'init-ack') {
      if (event.data.id === id) {
        debug('init-ack', event.data)
        fireAllListeners(event)
      }
    } else if (event.data.type === 'init') {
      debug('Got init')
      channel.postMessage({
        type: 'init-ack',
        id: event.data.id,
        value: last || store.get(baseAtom),
      })
    }
  }

  const broadcastAtom = atom(
    (get) => get(baseAtom),
    (get, set, update: { isEvent: boolean; value: SetStateAction<Value> }) => {
      set(baseAtom, update.value)
      if (!update.isEvent) {
        last = get(baseAtom)
        channel.postMessage({ type: 'update', value: last })
      }
    }
  )

  const onMount: typeof broadcastAtom.onMount = (setAtom) => {
    const listener = (event: MessageEvent<Event<Value>>) => {
      if (event.data.type === 'update') {
        setAtom({ isEvent: true, value: event.data.value })
      }
    }
    listeners.add(listener)
    if (isMem || IS_WEB_WORKER) {
      debug('Posting init')
      channel.postMessage({ type: 'init', id })
    }
    return () => {
      listeners.delete(listener)
    }
  }

  broadcastAtom.onMount = onMount

  const returnedAtom = atom(
    (get) => {
      return get(broadcastAtom)
    },
    (_get, set, update: SetStateAction<Value>) => {
      set(broadcastAtom, { isEvent: false, value: update })
    }
  )

  return returnedAtom
}
