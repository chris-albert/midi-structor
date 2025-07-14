import { SyncStorage } from 'jotai/vanilla/utils/atomWithStorage'
import { atomWithStorage, createJSONStorage } from 'jotai/utils'
import { PrimitiveAtom } from 'jotai'
import { Schema, Either } from 'effect'
import { log } from '../logger/log'

const storage = <A>(): SyncStorage<A> => createJSONStorage<A>()

const schemaStorage = <A>(): SyncStorage<A> => {
  return createJSONStorage<A>(() => localStorage, {
    replacer: (key, value) => {
      return Either.match(Schema.encodeEither(Schema.Any)(value), {
        onRight: (value) => value,
        onLeft: (error) => {
          log.error('Unable to encode value', value)
          return {}
        },
      })
    },
    reviver: (key, value) => {
      const a = Either.match(Schema.decodeUnknownEither(Schema.Any)(value), {
        onRight: (value) => value,
        onLeft: (error) => {
          log.error('Unable to parse from LocalStorage', value, error)
          return {}
        },
      })
      return a
    },
  })
}

const local = <A>(name: string, ifEmpty: A): PrimitiveAtom<A> =>
  atomWithStorage<A>(name, ifEmpty, storage(), {
    getOnInit: true,
  })

export const AtomStorage = {
  atom: local,
}
