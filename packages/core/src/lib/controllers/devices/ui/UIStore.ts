import { MidiMessage } from '@midi-structor/core'
import { State } from '../../../state/State'

export type UIMessageStore<A> = Record<string, A>

export type UIStore<A> = (name: string) => {
  put: () => (m: MidiMessage) => void
  useGet: () => UIMessageStore<A>
}

const state = <A>() =>
  State.family((id) =>
    State.memSingle<UIMessageStore<A>>(`message-store:${id}`, {})
  )

export const UIStore = {
  state,
}
