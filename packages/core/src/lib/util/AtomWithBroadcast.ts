import { atom, SetStateAction } from 'jotai'

type Update<A> = {
  type: 'update'
  value: A
}

type Init = {
  type: 'init'
}

type Event<A> = Update<A> | Init

export function atomWithBroadcast<Value>(key: string, initialValue: Value) {
  const baseAtom = atom(initialValue)
  const listeners = new Set<(event: MessageEvent<Event<Value>>) => void>()
  const channel = new BroadcastChannel(key)

  let last: Value = initialValue

  channel.onmessage = (e) => {
    const event = e as MessageEvent<Event<Value>>
    if (event.data.type === 'update') {
      listeners.forEach((l) => l(event))
    } else if (event.data.type === 'init') {
      channel.postMessage({ type: 'update', value: last })
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

  broadcastAtom.onMount = (setAtom) => {
    const listener = (event: MessageEvent<Event<Value>>) => {
      if (event.data.type === 'update') {
        setAtom({ isEvent: true, value: event.data.value })
      }
    }
    listeners.add(listener)
    channel.postMessage({ type: 'init' })
    return () => {
      listeners.delete(listener)
    }
  }

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
