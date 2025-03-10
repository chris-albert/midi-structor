import React from 'react'
import { ProjectMidi } from '../project/ProjectMidi'
import { ProjectHooks } from '../project/ProjectHooks'
import { ConfiguredController } from './ConfiguredController'
import { ControllerComponent } from './ControllerComponent'

export type ControllersComponentProps = {}

export const ControllersComponent: React.FC<ControllersComponentProps> = ({}) => {
  const [controllers] = ConfiguredController.useControllers()

  ProjectMidi.useProjectListener()

  ProjectHooks.useOnStatusChange((status) => {
    if (status === 'importing') {
      console.log('Importing new project.')
    } else if (status === 'done') {
      console.log(`Successfully imported project!`)
    }
  })

  return controllers.map((controller) => (
    <ControllerComponent
      key={`controller-${controller.name}`}
      controller={controller}
    />
  ))
}
