import { EventEmitter as NodeEventEmitter } from 'events'
import { log } from './logger/log'

export type EventEmitter<A> = {
  on: <N extends keyof A & string>(n: N, f: (a: A[N]) => void) => () => void
  emit: <N extends keyof A & string>(b: A[N]) => void
}

export const EventEmitter = <
  A extends Record<any, { type: string }>
>(): EventEmitter<A> => buildEmitter<A>(new NodeEventEmitter())

export const buildEmitter = <A extends Record<any, { type: string }>>(
  emitter: NodeEventEmitter
): EventEmitter<A> => ({
  on: <N extends keyof A & string>(n: N, f: (a: A[N]) => void) => {
    emitter.on(n, f)
    return () => {
      emitter.off(n, f)
    }
  },
  emit: <N extends keyof A>(b: A[N]) => {
    emitter.emit('*', b)
    emitter.emit(b.type, b)
  },
})

export type EventRecord<A extends { type: string }> = {
  [E in A as E['type']]: E
} & {
  '*': A
}

export type EventEmitterWithBroadcast<A> = {
  emitter: EventEmitter<A>
  listener: EventEmitter<A>
}

export const EventEmitterWithBroadcast = <
  A extends Record<any, { type: string }>
>(
  name: string
): EventEmitterWithBroadcast<A> => {
  // const debug = log.enabled(name === 'controller:worker', log.info)
  const debug = log.enabled(false, log.info)
  const emitter = EventEmitter<A>()
  const listener = EventEmitter<A>()
  const channel = new BroadcastChannel(name)

  channel.onmessage = (event) => {
    debug('Received message', event)
    listener.emit(event.data)
  }

  emitter.on('*', (data) => {
    debug('Emitting event', data)
    channel.postMessage(data)
  })

  return { emitter, listener }
}
