import { atom, PrimitiveAtom, SetStateAction, getDefaultStore } from 'jotai'
import { v4 } from 'uuid'
import { ProcessManager, ProcessType } from '../ProcessManager'
import { log } from '../logger/log'

const store = getDefaultStore()

type Update<A> = {
  type: 'update'
  value: A
}

type UpdateRequest<A> = {
  type: 'update-request'
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

type Event<A> = Update<A> | UpdateRequest<A> | Init | InitAck<A>

/**
 * We are defining the concept of `owner`, we need this since we are using
 * web-workers, and need a clean way to init and update all the `borrowers`.
 *
 * Rules:
 * 1. `borrowers` can *only* get state updates from the `owner` (no internal updates)
 * 2. `borrowers` can *only* update state by sending a message to the `owner`
 *
 * We also need to be careful with how each instance is initialized, since
 * we are using web-workers there are many different orders each `atom` is
 * created in.
 *
 * Scenario 1: Clean and easy
 * The `owner` is loaded first, then each `borrower`. When each `borrower` is
 * loaded, it sends aa `init` message to its `channel`, which only the
 * `owner` will process and send back an `init-ack` to the `channel`. Now since
 * we can have multiple `borrowers`, we need to only listen for `init` events
 * tagged with our `id.
 *
 */
export const atomWithBroadcast = <Value>(
  owner: ProcessType,
  key: string,
  baseAtom: PrimitiveAtom<Value>
): PrimitiveAtom<Value> => {
  const isOwner = owner === ProcessManager.type
  const channel = new BroadcastChannel(key)
  const id = v4()

  // const debug = log.enabled(key === 'projects-config', log.info)
  const debug = log.enabled(false, log.info)

  debug('Creating', { owner, isOwner, key, id })

  let last: Value | undefined = undefined

  const broadcastAtom = atom(
    (get) => get(baseAtom),
    (get, set, update: { isEvent: boolean; value: SetStateAction<Value> }) => {
      const value: Value =
        typeof update.value === 'function'
          ? (update.value as (p: Value) => Value)(get(baseAtom))
          : update.value
      if (isOwner) {
        // Only update local state and post changes if owner
        set(baseAtom, update.value)
        last = value
        debug('Posting message as owner', value)
        channel.postMessage({ type: 'update', value })
      } else {
        // I'm not the owner and got an update from the owner
        if (update.isEvent) {
          set(baseAtom, update.value)
        } else {
          debug('Posting message as borrower', value)
          channel.postMessage({ type: 'update-request', value })
        }
      }
    }
  )

  const fireAllListeners = (event: MessageEvent<Event<Value>>) => {
    if (
      event.data.type === 'update' ||
      event.data.type === 'update-request' ||
      event.data.type === 'init-ack'
    ) {
      store.set(broadcastAtom, { isEvent: true, value: event.data.value })
    }
  }

  channel.onmessage = (e) => {
    const event = e as MessageEvent<Event<Value>>
    debug('Received message', event.data)
    if (event.data.type === 'update-request' && isOwner) {
      fireAllListeners(event)
    }
    if (event.data.type === 'update') {
      fireAllListeners(event)
    }
    if (isOwner && event.data.type === 'init') {
      channel.postMessage({
        type: 'init-ack',
        id: event.data.id,
        value: last || store.get(baseAtom),
      })
    } else if (
      !isOwner &&
      event.data.type === 'init-ack' &&
      event.data.id === id
    ) {
      fireAllListeners(event)
    }
  }

  if (!isOwner) {
    debug('Posting init')
    channel.postMessage({ type: 'init', id })
  }

  const returnedAtom = atom(
    (get) => {
      return get(broadcastAtom)
    },
    (_get, set, update: SetStateAction<Value>) => {
      debug('Atom set', update)
      set(broadcastAtom, { isEvent: false, value: update })
    }
  )

  return returnedAtom
}
