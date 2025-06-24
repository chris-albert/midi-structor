import { SyncStorage } from 'jotai/vanilla/utils/atomWithStorage'
import { atomWithStorage, createJSONStorage } from 'jotai/utils'
import { PrimitiveAtom } from 'jotai/index'

const storage = <A>(): SyncStorage<A> => {
  return createJSONStorage<A>()
}

const atom = <A>(name: string, ifEmpty: A): PrimitiveAtom<A> =>
  atomWithStorage<A>(name, ifEmpty, storage(), {
    getOnInit: true,
  })

export const AtomStorage = {
  atom,
}
