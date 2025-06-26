import { atom, PrimitiveAtom, SetStateAction, getDefaultStore } from 'jotai'
import { AtomStorage } from '../storage/AtomStorage'

const store = getDefaultStore()

type Update<A> = {
  type: 'update'
  value: A
}

type Init = {
  type: 'init'
}

type Event<A> = Update<A> | Init

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

  let last: Value | undefined = undefined

  channel.onmessage = (e) => {
    const event = e as MessageEvent<Event<Value>>
    if (event.data.type === 'update') {
      listeners.forEach((l) => l(event))
    } else if (event.data.type === 'init') {
      channel.postMessage({
        type: 'update',
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
      channel.postMessage({ type: 'init' })
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
