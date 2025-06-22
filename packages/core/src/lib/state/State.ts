import React from 'react'
import {
  atom,
  getDefaultStore,
  SetStateAction,
  useAtomValue,
  useSetAtom,
  WritableAtom,
} from 'jotai'
import { atomWithBroadcast } from '../util/AtomWithBroadcast'
import { AtomStorage } from '../storage/AtomStorage'
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
}

const fromAtom = <A>(
  atom: WritableAtom<A, [update: SetStateAction<A>], void>
): State<A> => {
  const get = (): A => {
    // @ts-ignore
    let a: A = null
    store.set(atom, (aa) => {
      a = aa
      return aa
    })
    return a
  }

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

  return {
    get,
    set,
    sub,
    useValue,
    useSet,
    use,
    focus,
    useFocusMemo,
  }
}

const memSingle = <A>(name: string, initial: A): State<A> =>
  fromAtom<A>(atom(initial))

const mem = <A>(name: string, initial: A): State<A> =>
  fromAtom<A>(atomWithBroadcast(name, initial))

const storage = <A>(name: string, initial: A): State<A> =>
  fromAtom<A>(AtomStorage.atom<A>(name, initial))

const array = <A>(state: State<Array<A>>): Array<State<A>> =>
  state.get().map((a, i) => memSingle(`array-element-${i}`, a))

export const State = {
  mem,
  memSingle,
  storage,
  array,
}
