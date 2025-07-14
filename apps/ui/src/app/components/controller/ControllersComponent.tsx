import React from 'react'
import { TabItem, TabsComponent } from '../TabsComponent'
import { Box } from '@mui/material'
import AddCircleIcon from '@mui/icons-material/AddCircle'
import { AddControllerComponent } from './AddControllerComponent'
import { ConfiguredControllerHooks } from '@midi-structor/core'
import { ControllerComponent } from './ControllerComponent'
import { ControllerAvatarComponent } from './ControllerAvatarComponent'

const addTabItem: TabItem = {
  icon: () => <AddCircleIcon />,
  content: () => <AddControllerComponent />,
}

export type ControllersComponentProps = {}

export const ControllersComponent: React.FC<
  ControllersComponentProps
> = ({}) => {
  const controllers = ConfiguredControllerHooks.useControllerStates()

  const controllersTabs: Array<TabItem> = [
    ...controllers.map((controller) => ({
      icon: () => <ControllerAvatarComponent controllerState={controller} />,
      content: () => <ControllerComponent controllerState={controller} />,
    })),
    addTabItem,
  ]

  return (
    <Box sx={{ height: '100%' }}>
      <TabsComponent
        orientation='vertical'
        tabs={controllersTabs}
      />
    </Box>
  )
}
