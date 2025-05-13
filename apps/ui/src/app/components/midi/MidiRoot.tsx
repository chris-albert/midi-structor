import React from 'react'
import { MidiAccess } from '../../midi/MidiAccess'
import { ProjectHooks, ProjectMidi } from '@midi-structor/core'
import { toast } from 'react-toastify'

export type MidiRootProps = {}

export const MidiRoot: React.FC<MidiRootProps> = ({}) => {
  MidiAccess.useAccess()

  ProjectMidi.useProjectListener()

  ProjectHooks.useOnStatusChange((status) => {
    if (status.type === 'ack') {
      toast.info(`Initializing project ${status.projectName}.`)
    } else if (status.type === 'importing') {
      toast.info('Importing project.')
    } else if (status.type === 'done') {
      toast.success(`Successfully imported!`)
    }
  })

  return <></>
}
