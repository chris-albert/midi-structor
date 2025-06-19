import React from 'react'
import _ from 'lodash'
import { List } from 'immutable'
import { emptyTrack, UIClip, UITrack } from './UIStateDisplay'
import { useListState } from '../hooks/ListAtom'
import { Option } from 'effect'
import { ProjectConfig } from './ProjectConfig'
import { ProjectImportStatus, ProjectState } from '../state/ProjectState'

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

const useArrangement = () => ProjectState.project.arrangement.useValue()

const useTracks = () => {
  const arrangement = useArrangement()
  return arrangement.tracks
}

const useTrackOrUndefined = (trackName: string): UITrack | undefined => {
  const tracks = useTracks()
  return tracks.find((t) => t.name === trackName)
}

const useTrack = (trackName: string) => {
  const track = useTrackOrUndefined(trackName)
  return track === undefined ? emptyTrack : track
}

const useSetActiveProject = () => ProjectState.project.active.useSet()
const useActiveProjectName = () => ProjectState.project.active.useValue()

const useActiveProjectValue = () => {
  const activeProject = useActiveProjectName()
  const projects = ProjectState.project.config.useValue()
  const project = _.find(projects.projects, (p) => p.key === activeProject)

  return project || ProjectConfig.defaultProjectConfig()
}

const useUpdateActiveProject = () => {
  const active = useActiveProjectName()
  const projects = ProjectState.project.config.useValue()
  const setProjects = ProjectState.project.config.useSet()
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

const useProjects = () => ProjectState.project.config.useValue()

const useSetActiveProjectName = () => {
  const updateProject = useUpdateActiveProject()
  const projects = useProjects()

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
    ...ProjectConfig.defaultProjectConfig().style,
    ...project.style,
  }
  return {
    ...style,
    horizontalGradient: `linear-gradient(to right, ${style.accent.color1}, ${style.accent.color2})`,
    leftVerticalGradient: `linear-gradient(to bottom, ${style.accent.color1}, ${style.accent.color2})`,
    rightVerticalGradient: `linear-gradient(to top, ${style.accent.color1}, ${style.accent.color2})`,
  }
}

const useProjectsConfig = () => useProjects()

const useActiveProjectLabel = () => {
  const activeProject = ProjectState.project.active.useValue()
  const projects = useProjects()
  const project = _.find(projects.projects, (p) => p.key === activeProject)
  if (project !== undefined) {
    return project.label
  } else {
    return undefined
  }
}

const useProjectsListAtom = () => {
  const projects = ProjectState.project.config.useFocusMemo((o) =>
    o.prop('projects')
  )
  return useListState(projects)
}

const useAbletonProjectName = () => ProjectState.project.abletonName.useValue()

const useOnStatusChange = (f: (status: ProjectImportStatus) => void) => {
  const importStatus = ProjectState.importStatus.useValue()
  React.useEffect(() => f(importStatus), [importStatus])
}

const useIsProjectLoading = () =>
  ProjectState.importStatus.useValue().type !== 'done'

const useBeat = () => ProjectState.realTime.beats.useValue()
const useBarBeats = () => ProjectState.realTime.barBeats.useValue()
const useTimeSignature = () => ProjectState.realTime.timeSignature.useValue()
const useTempo = () => ProjectState.realTime.tempo.useValue()
const useIsPlaying = () => ProjectState.realTime.isPlaying.useValue()
const useMetronomeState = () => ProjectState.realTime.metronomeState.useValue()
const getMetronomeState = () => ProjectState.realTime.metronomeState.get()
const useLoopState = () => ProjectState.realTime.loopState.useValue()
const getLoopState = () => ProjectState.realTime.loopState.get()

const useOnProjectLoad = () => {
  const projects = useProjects()
  const activeProject = useActiveProjectName()
  const setActiveProject = useSetActiveProject()
  return (abletonProject: string) => {
    const project = List(projects.projects).find(
      (p) => p.abletonProject === abletonProject
    )
    if (project !== undefined && abletonProject !== activeProject) {
      setActiveProject(project.key)
    }
  }
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
  useActiveProjectName,
  useUpdateActiveProject,
  useTracks,
  useTrack,
  useTrackOrUndefined,
  useMetronomeState,
  getMetronomeState,
  useLoopState,
  getLoopState,
  useOnProjectLoad,
  useIsProjectLoading,
}
