import { MidiMessage } from '@midi-structor/core'

export type UIMessageStore<A> = Record<string, A>

export type UIStore<A> = (name: string) => {
  usePut: () => (m: MidiMessage) => void
  useGet: () => UIMessageStore<A>
}
