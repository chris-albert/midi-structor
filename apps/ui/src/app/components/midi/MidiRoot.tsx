import React from 'react'
import { MidiAccess } from '../../midi/MidiAccess'
import {
  ConfiguredController,
  Midi,
  ProjectHooks,
  ProjectMidi,
  TX_MESSAGE,
} from '@midi-structor/core'
import { toast } from 'react-toastify'

export type MidiRootProps = {}

export const MidiRoot: React.FC<MidiRootProps> = ({}) => {
  const dawEmitter = Midi.useDawEmitter()

  MidiAccess.useAccess()
  ProjectMidi.useProjectListener()

  const tracks = ConfiguredController.useProjectTracks()
  const onProjectLoad = ProjectHooks.useOnProjectLoad()

  React.useEffect(() => {
    dawEmitter.send(TX_MESSAGE.init())
  }, [dawEmitter])

  ProjectHooks.useOnStatusChange((status) => {
    if (status.type === 'ack') {
      dawEmitter.send(TX_MESSAGE.initReady(tracks))
    }
  })

  ProjectHooks.useOnStatusChange((status) => {
    if (status.type === 'ack') {
      toast.info(`Initializing project ${status.projectName}.`)
      onProjectLoad(status.projectName)
    } else if (status.type === 'importing') {
      toast.info('Importing project.')
    } else if (status.type === 'done') {
      toast.success(`Successfully imported!`)
    }
  })

  return <></>
}
