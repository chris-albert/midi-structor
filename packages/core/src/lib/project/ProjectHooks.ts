import {
  atom,
  getDefaultStore,
  useAtom,
  useAtomValue,
  useSetAtom,
  WritableAtom,
} from 'jotai'
import { ProjectConfig, ProjectImportStatus, ProjectMidi } from './ProjectMidi'
import React from 'react'
import _ from 'lodash'
import { List } from 'immutable'
import { focusAtom } from 'jotai-optics'
import { splitAtom } from 'jotai/utils'
import { emptyTrack, UIArrangement, UIClip, UITrack } from './UIStateDisplay'
import { useListAtom } from '../hooks/ListAtom'
import { Option } from 'effect'

const store = getDefaultStore()

const isClipActive = (clip: UIClip, beat: number): boolean => {
  return (
    beat >= clip.startTime &&
    (clip.endTime === undefined || beat < clip.endTime)
  )
}

export const searchActiveClip = (
  clips: Array<UIClip>,
  beat: number
): UIClip => {
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
  const arrangement: WritableAtom<UIArrangement, [UIArrangement], void> =
    useArrangementAtom()

  return React.useMemo(
    () => focusAtom(arrangement, (o) => o.prop('tracks')),
    [arrangement]
  )
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

const useActiveProjectValue = () => {
  const activeProject = useAtomValue(ProjectMidi.atoms.project.active)
  const projects = useAtomValue(ProjectMidi.atoms.projectsConfig)
  const project = _.find(projects.projects, (p) => p.key === activeProject)

  return project || ProjectMidi.defaultProjectConfig()
}

const useUpdateActiveProject = () => {
  const active = useAtomValue(ProjectMidi.atoms.project.active)
  const [projects, setProjects] = useAtom(ProjectMidi.atoms.projectsConfig)
  const projectsList = List(projects.projects)
  const origProjectIndex = projectsList.findIndex((p) => p.key === active)
  return (newProjectFunc: (pc: ProjectConfig) => ProjectConfig) => {
    const newProjects =
      origProjectIndex !== undefined
        ? projectsList.set(
            origProjectIndex,
            // @ts-ignore
            newProjectFunc(projects.projects[origProjectIndex])
          )
        : projectsList
    setProjects({ projects: newProjects.toArray() })
  }
}

const useSetActiveProjectName = () => {
  const updateProject = useUpdateActiveProject()
  const projects = useAtomValue(ProjectMidi.atoms.projectsConfig)

  return (newProject: string): Option.Option<string> => {
    const exists = projects.projects.findIndex((p) => p.label === newProject)
    if (exists === -1) {
      updateProject((p) => ({
        ...p,
        label: newProject,
      }))
      return Option.none()
    } else {
      return Option.some(`Project ${newProject} already exists`)
    }
  }
}

const useProjectStyle = () => {
  const project = useActiveProjectValue()
  const style = {
    ...ProjectMidi.defaultProjectConfig().style,
    ...project.style,
  }
  return {
    ...style,
    horizontalGradient: `linear-gradient(to right, ${style.accent.color1}, ${style.accent.color2})`,
    leftVerticalGradient: `linear-gradient(to bottom, ${style.accent.color1}, ${style.accent.color2})`,
    rightVerticalGradient: `linear-gradient(to top, ${style.accent.color1}, ${style.accent.color2})`,
  }
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
    () =>
      focusAtom(ProjectMidi.atoms.projectsConfig, (o) => o.prop('projects')),
    [ProjectMidi.atoms.projectsConfig]
  )
  return useListAtom(projects)
}

const useAbletonProjectName = () =>
  useAtomValue(ProjectMidi.atoms.project.abletonName)

const useSetActiveProject = () => useSetAtom(ProjectMidi.atoms.project.active)

const useOnStatusChange = (f: (status: ProjectImportStatus) => void) => {
  const importStatus = useAtomValue(ProjectMidi.atoms.importStatus)
  React.useEffect(() => f(importStatus), [importStatus])
}

const useBeat = () => useAtomValue(ProjectMidi.atoms.realTime.beats)
const useBarBeats = () => useAtomValue(ProjectMidi.atoms.realTime.barBeats)
const useTimeSignature = () =>
  useAtomValue(ProjectMidi.atoms.realTime.timeSignature)
const useTempo = () => useAtomValue(ProjectMidi.atoms.realTime.tempo)
const useIsPlaying = () => useAtomValue(ProjectMidi.atoms.realTime.isPlaying)
const useMetronomeState = () =>
  useAtomValue(ProjectMidi.atoms.realTime.metronomeState)
const getMetronomeState = () => {
  return store.get(ProjectMidi.atoms.realTime.metronomeState)
}
const useLoopState = () => useAtomValue(ProjectMidi.atoms.realTime.loopState)
const getLoopState = () => {
  return store.get(ProjectMidi.atoms.realTime.loopState)
}

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
  useProjectStyle,
  useAbletonProjectName,
  useSetActiveProjectName,
  useActiveProjectValue,
  useUpdateActiveProject,
  useTracks,
  useTrack,
  useTrackOrUndefined,
  useMetronomeState,
  getMetronomeState,
  useLoopState,
  getLoopState,
  useTracksAtoms: () => {
    return useAtomValue(splitAtom(useTracksAtom()))
  },
}
