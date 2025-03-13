import { useAtom, useAtomValue, useSetAtom, WritableAtom } from 'jotai'
import { ProjectImportStatus, ProjectMidi } from './ProjectMidi'
import React from 'react'
import _ from 'lodash'
import { focusAtom } from 'jotai-optics'
import { splitAtom } from 'jotai/utils'
import { emptyTrack, UIArrangement, UIClip, UITrack } from './UIStateDisplay'
import { useListAtom } from '../hooks/ListAtom'

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
  // return React.useMemo(() => ProjectMidi.atoms.project.arrangement(activeProject), [activeProject])
  return ProjectMidi.atoms.project.arrangement(activeProject)
}

const useArrangement = () => useAtomValue(useArrangementAtom())

const useTracksAtom = () => {
  const arrangement: WritableAtom<UIArrangement, [UIArrangement], void> = useArrangementAtom()

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

const useProjectsConfig = () => useAtom(ProjectMidi.atoms.projectsConfig)

const useActiveProjectLabel = () => {
  const activeProject = useAtomValue(ProjectMidi.atoms.project.active)
  const projects = useAtomValue(ProjectMidi.atoms.projectsConfig)
  const project = _.find(projects.projects, (p) => p.key === activeProject)
  if (project !== undefined) {
    return project.label
  } else {
    return undefined
  }
}

const useProjectsListAtom = () => {
  const projects = React.useMemo(
    () => focusAtom(ProjectMidi.atoms.projectsConfig, (o) => o.prop('projects')),
    [ProjectMidi.atoms.projectsConfig]
  )
  return useListAtom(projects)
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
  useProjectsConfig,
  useProjectsListAtom,
  useActiveProjectLabel,
  useSetActiveProject,
  useTracks,
  useTrack,
  useTrackOrUndefined,
  useTracksAtoms: () => {
    return useAtomValue(splitAtom(useTracksAtom()))
  },
}
