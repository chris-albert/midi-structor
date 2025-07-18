import React from 'react'
import { MidiAccess } from '../../midi/MidiAccess'
import { log, ProjectHooks, ProjectImportStatus } from '@midi-structor/core'
import { toast } from 'react-toastify'

export type MidiRootProps = {}

const onStatusChange = (status: ProjectImportStatus) => {
  if (status.type === 'ack') {
    toast.info(`Initializing project ${status.projectName}.`)
    // onProjectLoad(status.projectName)
  } else if (status.type === 'importing') {
    toast.info('Importing project.')
  } else if (status.type === 'done') {
    if (status.parsedMessageCount === status.sourceMessageCount) {
      toast.success(`Successfully imported!`)
    } else {
      toast.warn(
        `Imported... but missing [${
          status.sourceMessageCount - status.parsedMessageCount
        }] message(s)`
      )
    }
  }
}

const MidiStatusChangeComponent: React.FC = () => {
  ProjectHooks.useOnStatusChange(onStatusChange)
  return <></>
}

export const MidiRoot: React.FC<MidiRootProps> = ({}) => {
  MidiAccess.useAccess()

  return <MidiStatusChangeComponent />
}
