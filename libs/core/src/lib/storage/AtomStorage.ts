import { SyncStorage, SyncStringStorage } from 'jotai/vanilla/utils/atomWithStorage'
import { createJSONStorage } from 'jotai/utils'
import * as fs from 'fs'

const safeEnv = (name: string, ifEmpty: string): string => {
  try {
    const e = process.env[name]
    if (e !== undefined) {
      return e
    }
  } catch (e) {}
  return ifEmpty
}

const STORAGE_PATH = safeEnv('MIDI_STRUCTOR_PATH', '~/.midi-structor')

const IS_AGENT = safeEnv('NX_TASK_TARGET_PROJECT', 'browser') === 'agent'

const serverStorage = (): SyncStringStorage => ({
  getItem: (key: string): string => {
    return fs.readFileSync(`${STORAGE_PATH}/${key}`, 'utf8')
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
    console.log('usuing agent')
    return createJSONStorage<A>(serverStorage)
  } else {
    return createJSONStorage<A>()
  }
}

export const AtomStorage = {
  storage,
}
