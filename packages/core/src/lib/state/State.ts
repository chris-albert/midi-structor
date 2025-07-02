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
  sub: (f: (a: A) => SubCleanup) => SubCleanup
  subAndInit: (f: (a: A) => SubCleanup) => void

  useValue: () => Awaited<A>
  useSet: () => (s: Set<A>) => void
  use: () => [Awaited<A>, (s: Set<A>) => void]

  focus: <B>(f: (o: OpticFor_<A>) => Lens<A, any, B>) => State<B>
  useFocusMemo: <B>(f: (o: OpticFor_<A>) => Lens<A, any, B>) => State<B>
  useFocus: <B extends keyof A>(key: B) => State<A[B]>

  array: () => A extends Array<infer B> ? Array<State<B>> : never
  useArray: () => A extends Array<infer B> ? Array<State<B>> : never
}

const fromAtom = <A>(
  atom: WritableAtom<A, [update: SetStateAction<A>], void>,
  name: string
): State<A> => {
  const get = (): A => store.get(atom)

  const set = (s: Set<A>): void => {
    store.set(atom, s)
  }

  let subCleanup: (() => void) | undefined = undefined
  const _sub = (f: (a: A) => SubCleanup, onInit: boolean): SubCleanup => {
    const callF = () => {
      const res = f(get())
      if (typeof res === 'function') {
        subCleanup = res
      }
    }
    if (onInit) {
      callF()
    }
    const _subCleanup = store.sub(atom, () => {
      if (subCleanup !== undefined) {
        subCleanup()
      }
      callF()
    })
    return () => {
      _subCleanup()
    }
  }

  const sub = (f: (a: A) => SubCleanup): SubCleanup => _sub(f, false)
  const subAndInit = (f: (a: A) => SubCleanup): SubCleanup => _sub(f, true)

  const useValue = () => useAtomValue(atom)
  const useSet = () => useSetAtom(atom)
  const use = (): [Awaited<A>, (s: Set<A>) => void] => [useValue(), useSet()]

  const focus = <B>(f: (o: OpticFor_<A>) => Lens<A, any, B>): State<B> =>
    fromAtom(focusAtom(atom, f), name)

  const useFocus = <B extends keyof A>(key: B): State<A[B]> => {
    const cb = React.useCallback((o: OpticFor_<A>) => o.prop(key), [key])
    return focus<A[B]>(cb)
  }

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
    return store.get(splitAtom(arrayAtom)).map((a) => fromAtom(a, name)) as any
  }

  const useArray = (): A extends Array<infer B> ? Array<State<B>> : never => {
    const arrayAtom: PrimitiveAtom<Array<A>> = atom as unknown as PrimitiveAtom<
      Array<A>
    >
    return useAtomValue(splitAtom(arrayAtom)).map((a) =>
      fromAtom(a, name)
    ) as any
  }

  return {
    get,
    set,
    sub,
    subAndInit,
    useValue,
    useSet,
    use,
    focus,
    useFocus,
    useFocusMemo,
    array,
    useArray,
  }
}

const memSingle = <A>(name: string, initial: A): State<A> =>
  fromAtom<A>(atom(initial), name)

const mem = <A>(name: string, initial: A): State<A> =>
  fromAtom<A>(atomWithBroadcast<A>(name, initial), name)

const storage = <A>(name: string, initial: A): State<A> =>
  fromAtom<A>(atomWithBroadcast<A>(name, initial, 'storage'), name)

const FAMILY_CACHE: Record<string, State<any>> = {}

const family =
  <A>(f: (n: string) => State<A>): ((n: string) => State<A>) =>
  (name) => {
    const exists = FAMILY_CACHE[name]
    if (exists !== undefined) {
      return exists as State<A>
    } else {
      const init = f(name)
      FAMILY_CACHE[name] = init
      return init
    }
  }

export const State = {
  mem,
  memSingle,
  storage,
  family,
}
