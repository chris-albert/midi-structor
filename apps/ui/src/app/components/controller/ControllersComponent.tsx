import React from 'react'
import { TabItem, TabsComponent } from '../TabsComponent'
import { Box, LinearProgress } from '@mui/material'
import AddCircleIcon from '@mui/icons-material/AddCircle'
import { AddControllerComponent } from './AddControllerComponent'
import { ConfiguredController, ProjectHooks } from '@midi-structor/core'
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
  const controllers = ConfiguredController.useControllersValue()
  const projectStyle = ProjectHooks.useProjectStyle()
  const isReloadProject = ConfiguredController.useIsReloadProject()

  if (isReloadProject) {
    return (
      <Box sx={{ width: '100%' }}>
        <LinearProgress />
      </Box>
    )
  } else {
    const controllersTabs: Array<TabItem> = [
      ...controllers.map((controller) => ({
        icon: () => <ControllerAvatarComponent controllerAtom={controller} />,
        content: () => <ControllerComponent controllerAtom={controller} />,
      })),
      addTabItem,
    ]

    return (
      <Box sx={{ height: '100%' }}>
        <TabsComponent
          orientation='vertical'
          tabs={controllersTabs}
          // slotProps={{
          //   tabs: {
          //     sx: {
          //       background: projectStyle.leftVerticalGradient,
          //     },
          //   },
          // }}
        />
      </Box>
    )
  }
}
