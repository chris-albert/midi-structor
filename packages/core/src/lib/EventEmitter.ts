import { EventEmitter as NodeEventEmitter } from 'events'

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

const EMITTER_CACHE: Record<string, EventEmitter<any>> = {}

export const EventEmitterWithBroadcast = <
  A extends Record<any, { type: string }>
>(
  name: string
): EventEmitter<A> => {
  const cached = EMITTER_CACHE[name]
  if (cached === undefined) {
    const emitter = EventEmitter<A>()
    const channel = new BroadcastChannel(name)

    channel.onmessage = (event) => {
      emitter.emit(event.data)
    }

    emitter.on('*', (data) => {
      channel.postMessage(data)
    })
    EMITTER_CACHE[name] = emitter
    return emitter
  } else {
    return cached
  }
}
