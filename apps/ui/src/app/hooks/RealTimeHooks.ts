import { useAtomValue } from 'jotai'
import { ProjectMidi, TimeSignature } from '../midi/ProjectMidi'

export const useBeat = (): number => {
  return useAtomValue(ProjectMidi.atoms.realTime.beats)
}

export const useBarBeats = (): number => {
  return useAtomValue(ProjectMidi.atoms.realTime.barBeats)
}

export const useTimeSignature = (): TimeSignature => {
  return useAtomValue(ProjectMidi.atoms.realTime.timeSignature)
}

export const useTempo = (): number => {
  return useAtomValue(ProjectMidi.atoms.realTime.tempo)
}

export const useIsPlaying = (): boolean => {
  return useAtomValue(ProjectMidi.atoms.realTime.isPlaying)
}
