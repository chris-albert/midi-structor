import { SyncStorage, SyncStringStorage } from 'jotai/vanilla/utils/atomWithStorage'
import { atomWithStorage, createJSONStorage } from 'jotai/utils'
import * as fs from 'fs'
import { PrimitiveAtom } from 'jotai/index'

const safeEnv = (name: string, ifEmpty: string): string => {
  try {
    const e = process.env[name]
    if (e !== undefined) {
      return e
    }
  } catch (e) {}
  return ifEmpty
}

const STORAGE_PATH = safeEnv('MIDI_STRUCTOR_PATH', '/Users/christopheralbert/.midi-structor')

const IS_AGENT = safeEnv('NX_TASK_TARGET_PROJECT', 'browser') === 'agent'

const serverStorage = (): SyncStringStorage => ({
  getItem: (key: string): string => {
    try {
      return fs.readFileSync(`${STORAGE_PATH}/${key}`, 'utf8')
    } catch (e) {}
    return ''
  },
  setItem: (key: string, newValue: string): void => {
    fs.writeFileSync(`${STORAGE_PATH}/${key}`, newValue)
  },
  removeItem: (key: string): void => {
    fs.unlinkSync(`${STORAGE_PATH}/${key}`)
  },
})

const storage = <A>(): SyncStorage<A> => {
  if (IS_AGENT) {
    return createJSONStorage<A>(serverStorage)
  } else {
    return createJSONStorage<A>()
  }
}

const atom = <A>(name: string, ifEmpty: A): PrimitiveAtom<A> =>
  atomWithStorage<A>(name, ifEmpty, storage(), {
    getOnInit: true,
  })

export const AtomStorage = {
  atom,
}
