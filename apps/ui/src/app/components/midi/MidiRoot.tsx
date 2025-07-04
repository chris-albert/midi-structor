import React from 'react'
import { MidiAccess } from '../../midi/MidiAccess'
import { ProjectHooks, ProjectImportStatus } from '@midi-structor/core'
import { toast } from 'react-toastify'

export type MidiRootProps = {}

const onStatusChange = (status: ProjectImportStatus) => {
  if (status.type === 'ack') {
    toast.info(`Initializing project ${status.projectName}.`)
    // onProjectLoad(status.projectName)
  } else if (status.type === 'importing') {
    toast.info('Importing project.')
  } else if (status.type === 'done') {
    toast.success(`Successfully imported!`)
  }
}

const MidiStatusChangeComponent: React.FC = () => {
  ProjectHooks.useOnStatusChange(onStatusChange)
  // const activeProject = ProjectHooks.useActiveProjectName()
  //
  // React.useEffect(() => {
  //   console.log('active project', activeProject)
  // }, [activeProject])
  return <></>
}

export const MidiRoot: React.FC<MidiRootProps> = ({}) => {
  MidiAccess.useAccess()

  return <MidiStatusChangeComponent />
}
