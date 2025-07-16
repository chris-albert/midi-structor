import { SyncStorage } from 'jotai/vanilla/utils/atomWithStorage'
import { atomWithStorage, createJSONStorage } from 'jotai/utils'
import { PrimitiveAtom } from 'jotai'
import { Schema } from 'effect'
import { log } from '../logger/log'
import { SchemaHelper } from '../util/SchemaHelper'

const storage = <A>(): SyncStorage<A> => createJSONStorage<A>()

const schemaStorage = <A, I>(schema: Schema.Schema<A, I>): SyncStorage<A> => {
  const decode = (key: string, str: string | null, initialValue: A): A => {
    if (str !== null) {
      return SchemaHelper.decodeString({
        schema,
        str,
        ok: (v) => v,
        error: (error) => {
          log.error(
            `Unable to decode JSON storage object for key [${key}], using initialValue [${initialValue}]`,
            error
          )
          return initialValue
        },
      })
    } else {
      return initialValue
    }
  }

  const encode = (key: string, value: A): string =>
    SchemaHelper.encode(schema, value)

  return {
    getItem(key, initialValue) {
      return decode(key, localStorage.getItem(key), initialValue)
    },
    setItem(key, value) {
      localStorage.setItem(key, encode(key, value))
    },
    removeItem(key) {
      localStorage.removeItem(key)
    },
    subscribe(key, callback, initialValue) {
      if (
        typeof window === 'undefined' ||
        typeof window.addEventListener === 'undefined'
      ) {
        return () => {}
      }
      const handler = (e: StorageEvent) => {
        if (e.storageArea === localStorage && e.key === key) {
          callback(decode(key, e.newValue, initialValue))
        }
      }
      window.addEventListener('storage', handler)
      return () => window.removeEventListener('storage', handler)
    },
  }
}

const local = <A>(name: string, ifEmpty: A): PrimitiveAtom<A> =>
  atomWithStorage<A>(name, ifEmpty, storage(), {
    getOnInit: true,
  })

const schema = <A, I>(
  name: string,
  ifEmpty: A,
  schema: Schema.Schema<A, I>
): PrimitiveAtom<A> =>
  atomWithStorage<A>(name, ifEmpty, schemaStorage(schema), {
    getOnInit: true,
  })

export const AtomStorage = {
  atom: local,
  schema,
}
