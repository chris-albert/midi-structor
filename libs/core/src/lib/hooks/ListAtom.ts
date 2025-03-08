import { useAtom, PrimitiveAtom } from 'jotai'

export const useListAtom = <A>(atom: PrimitiveAtom<Array<A>>) => {
  const [values, setValues] = useAtom<Array<A>>(atom)

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
