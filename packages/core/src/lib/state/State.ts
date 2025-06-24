import React from 'react'
import {
  atom,
  getDefaultStore,
  PrimitiveAtom,
  SetStateAction,
  useAtomValue,
  useSetAtom,
  WritableAtom,
} from 'jotai'
import { atomWithBroadcast } from '../util/AtomWithBroadcast'
import { focusAtom } from 'jotai-optics'
import { Lens, OpticFor_ } from 'optics-ts'
import { splitAtom } from 'jotai/utils'

const store = getDefaultStore()

type SubCleanup = (() => void) | void
type Set<A> = ((a: A) => A) | A

export type State<A> = {
  get: () => A
  set: (s: Set<A>) => void
  sub: (f: (a: A) => SubCleanup) => void

  useValue: () => Awaited<A>
  useSet: () => (s: Set<A>) => void
  use: () => [Awaited<A>, (s: Set<A>) => void]

  focus: <B>(f: (o: OpticFor_<A>) => Lens<A, any, B>) => State<B>
  useFocusMemo: <B>(f: (o: OpticFor_<A>) => Lens<A, any, B>) => State<B>

  array: () => A extends Array<infer B> ? Array<State<B>> : never
}

const fromAtom = <A>(
  atom: WritableAtom<A, [update: SetStateAction<A>], void>
): State<A> => {
  const get = (): A => store.get(atom)

  const set = (s: Set<A>): void => {
    store.set(atom, s)
  }

  let subCleanup: (() => void) | undefined = undefined
  const sub = (f: (a: A) => SubCleanup): void => {
    store.sub(atom, () => {
      if (subCleanup !== undefined) {
        subCleanup()
      }
      const res = f(get())
      if (typeof res === 'function') {
        subCleanup = res
      }
    })
  }

  const useValue = () => useAtomValue(atom)
  const useSet = () => useSetAtom(atom)
  const use = (): [Awaited<A>, (s: Set<A>) => void] => [useValue(), useSet()]

  const focus = <B>(f: (o: OpticFor_<A>) => Lens<A, any, B>): State<B> =>
    fromAtom(focusAtom(atom, f))

  const useFocusMemo = <B>(
    f: (o: OpticFor_<A>) => Lens<A, any, B>
  ): State<B> => {
    const value = useValue()
    return React.useMemo(() => focus(f), [value])
  }

  const array = (): A extends Array<infer B> ? Array<State<B>> : never => {
    const arrayAtom: PrimitiveAtom<Array<A>> = atom as unknown as PrimitiveAtom<
      Array<A>
    >
    return store.get(splitAtom(arrayAtom)).map((a) => fromAtom(a)) as any
  }

  return {
    get,
    set,
    sub,
    useValue,
    useSet,
    use,
    focus,
    useFocusMemo,
    array,
  }
}

const memSingle = <A>(name: string, initial: A): State<A> =>
  fromAtom<A>(atom(initial))

const mem = <A>(name: string, initial: A): State<A> =>
  fromAtom<A>(atomWithBroadcast<A>(name, initial))

const storage = <A>(name: string, initial: A): State<A> =>
  fromAtom<A>(atomWithBroadcast<A>(name, initial, 'storage'))

export const State = {
  mem,
  memSingle,
  storage,
}
