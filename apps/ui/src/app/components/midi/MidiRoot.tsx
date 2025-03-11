import React from 'react'
import { MidiAccess } from '../../midi/MidiAccess'
import { ProjectHooks, ProjectMidi } from '@midi-structor/core'
import { toast } from 'react-toastify'

export type MidiRootProps = {}

export const MidiRoot: React.FC<MidiRootProps> = ({}) => {
  MidiAccess.useAccess()

  ProjectMidi.useProjectListener()

  ProjectHooks.useOnStatusChange((status) => {
    if (status === 'importing') {
      toast.info('Importing new project.')
    } else if (status === 'done') {
      toast.success(`Successfully imported project!`)
    }
  })

  return <></>
}
