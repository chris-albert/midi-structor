import { State } from '../state/State'

export const useListState = <A>(state: State<Readonly<Array<A>>>) => {
  const values = state.useValue()
  const setValues = state.useSet()

  const add = (a: A) => {
    setValues((prevValues) => [...prevValues, a])
  }

  const remove = (a: A) => {
    setValues((p) => p.filter((v) => v !== a))
  }

  const update = (orig: A, updated: A) => {
    setValues((p) => p.map((v) => (v === orig ? updated : v)))
  }

  return { add, remove, update, values }
}
