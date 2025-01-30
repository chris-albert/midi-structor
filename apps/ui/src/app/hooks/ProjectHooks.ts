import { useAtom, useAtomValue, useSetAtom } from 'jotai'
import { ProjectImportStatus, ProjectMidi } from '../midi/ProjectMidi'
import React from 'react'
import _ from 'lodash'
import { focusAtom } from 'jotai-optics'
import { splitAtom } from 'jotai/utils'
import { emptyTrack, UIClip, UITrack } from '../model/UIStateDisplay'

const isClipActive = (clip: UIClip, beat: number): boolean => {
  return beat >= clip.startTime && (clip.endTime === undefined || beat < clip.endTime)
}

export const searchActiveClip = (clips: Array<UIClip>, beat: number): UIClip => {
  return _.find(clips, (clip) => isClipActive(clip, beat)) as UIClip
}

export const useActiveClip = (track: UITrack): UIClip => {
  const beat = useBeat()

  return React.useMemo(() => searchActiveClip(track.clips, beat), [beat])
}

const useArrangementAtom = () => {
  const activeProject = useAtomValue(ProjectMidi.atoms.project.active)
  return React.useMemo(() => ProjectMidi.atoms.project.arrangement(activeProject), [activeProject])
}

const useArrangement = () => useAtomValue(useArrangementAtom())

const useTracksAtom = () => {
  const arrangement = useArrangementAtom()
  return React.useMemo(() => focusAtom(arrangement, (o) => o.prop('tracks')), [arrangement])
}

const useTracks = () => useAtomValue(useTracksAtom())

const useTrackOrUndefined = (trackName: string): UITrack | undefined => {
  const tracks = useAtomValue(useTracksAtom())
  return tracks.find((t) => t.name === trackName)
}

const useTrack = (trackName: string) => {
  const track = useTrackOrUndefined(trackName)
  return track === undefined ? emptyTrack : track
}

const useWidgets = () => {
  const activeProject = useAtomValue(ProjectMidi.atoms.project.active)
  return useAtom(React.useMemo(() => ProjectMidi.atoms.project.widgets(activeProject), [activeProject]))
}

const useProjectsConfig = () => useAtom(ProjectMidi.atoms.projectsConfig)

const useActiveProjectLabel = () => {
  const activeProject = useAtomValue(ProjectMidi.atoms.project.active)
  const projects = useAtomValue(ProjectMidi.atoms.projectsConfig)
  const project = _.get(projects.projects, activeProject, undefined)
  if (project !== undefined) {
    return project.name
  } else {
    return undefined
  }
}

const useSetActiveProject = () => useSetAtom(ProjectMidi.atoms.project.active)

const useOnStatusChange = (f: (status: ProjectImportStatus) => void) => {
  const importStatus = useAtomValue(ProjectMidi.atoms.importStatus)
  React.useEffect(() => f(importStatus), [importStatus])
}

const useBeat = () => useAtomValue(ProjectMidi.atoms.realTime.beats)
const useBarBeats = () => useAtomValue(ProjectMidi.atoms.realTime.barBeats)
const useTimeSignature = () => useAtomValue(ProjectMidi.atoms.realTime.timeSignature)
const useTempo = () => useAtomValue(ProjectMidi.atoms.realTime.tempo)
const useIsPlaying = () => useAtomValue(ProjectMidi.atoms.realTime.isPlaying)

export const ProjectHooks = {
  useOnStatusChange,
  useBeat,
  useBarBeats,
  useTimeSignature,
  useTempo,
  useIsPlaying,
  useActiveClip,
  useArrangement,
  useWidgets,
  useProjectsConfig,
  useActiveProjectLabel,
  useSetActiveProject,
  useTracks,
  useTrack,
  useTrackOrUndefined,
  useTracksAtoms: () => {
    return useAtomValue(splitAtom(useTracksAtom()))
  },
}
