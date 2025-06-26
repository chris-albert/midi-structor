import { SyncStorage } from 'jotai/vanilla/utils/atomWithStorage'
import { atomWithStorage, createJSONStorage } from 'jotai/utils'
import { PrimitiveAtom, atom } from 'jotai'
import { MiniDb } from 'jotai-minidb'

const DB = new MiniDb()

const storage = <A>(): SyncStorage<A> => {
  return createJSONStorage<A>()
}

const index = <A>(name: string, ifEmpty: A): PrimitiveAtom<A> => {
  const DB = new MiniDb<A>({
    name,
    initialData: {
      init: ifEmpty,
    },
  })

  const indexAtom = DB.item('init')

  // const a: PrimitiveAtom<A> = atom<A, A[], void>(
  // const a = atom(
  //   (get) => get(indexAtom) || ifEmpty,
  //   (get, set, action) => set(indexAtom, action)
  // )

  // return a
  throw new Error()
}

const local = <A>(name: string, ifEmpty: A): PrimitiveAtom<A> =>
  atomWithStorage<A>(name, ifEmpty, storage(), {
    getOnInit: true,
  })

export const AtomStorage = {
  atom: local,
}
