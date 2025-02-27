import React from 'react'
import { TabItem, TabsComponent } from '../TabsComponent'
import { Box } from '@mui/material'
import AddCircleIcon from '@mui/icons-material/AddCircle'
import { StringAvatarComponent } from '../StringAvatarComponent'
import { AddControllerComponent } from './AddControllerComponent'
import { ConfiguredController } from '@midi-structor/core'
import { ControllerComponent } from './ControllerComponent'

const addTabItem: TabItem = {
  icon: <AddCircleIcon />,
  content: () => <AddControllerComponent />,
}

export type ControllersComponentProps = {}

export const ControllersComponent: React.FC<ControllersComponentProps> = ({}) => {
  const controllers = ConfiguredController.useControllersValue()

  const controllersTabs: Array<TabItem> = [
    ...controllers.map((controller) => ({
      icon: (
        <StringAvatarComponent
          label={controller.name}
          size={35}
        />
      ),
      content: () => <ControllerComponent controller={controller} />,
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
