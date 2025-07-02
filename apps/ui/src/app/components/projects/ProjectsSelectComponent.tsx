import React from 'react'
import { Box } from '@mui/material'
import { SelectComponent, SelectItem } from '../form/SelectComponent'
import _ from 'lodash'
import {
  DefaultProjectConfig,
  ProjectConfig,
  ProjectHooks,
} from '@midi-structor/core'
import RefreshIcon from '@mui/icons-material/Refresh'
import IconButton from '@mui/material/IconButton'
import { useNavigate } from 'react-router-dom'

export type ProjectsSelectComponentProps = {}

export const ProjectsSelectComponent: React.FC<
  ProjectsSelectComponentProps
> = ({}) => {
  const setActiveProject = ProjectHooks.useSetActiveProject()

  const [items, setItems] = React.useState<Array<SelectItem<ProjectConfig>>>([])
  const activeProjectLabel = ProjectHooks.useActiveProjectLabel()
  const projects = ProjectHooks.useProjectsListAtom()
  const navigate = useNavigate()
  const refreshProject = ProjectHooks.useRefreshProject()

  React.useEffect(() => {
    setItems(
      _.map(projects.values, (p) => ({
        label: p.label,
        value: p,
      }))
    )
  }, [projects.values])

  const onProjectSelect = (input: ProjectConfig | undefined) => {
    if (input !== undefined) {
      setActiveProject(input.key)
    }
  }

  const onRefresh = () => {
    refreshProject()
    // navigate(0)
  }

  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
      }}>
      <IconButton
        aria-label='refresh'
        onClick={onRefresh}>
        <RefreshIcon />
      </IconButton>
      <SelectComponent
        label='Project'
        items={items}
        onChange={onProjectSelect}
        activeLabel={activeProjectLabel}
        onNew={(newLabel) => {
          projects.add({
            ...DefaultProjectConfig(),
            label: newLabel,
            key: _.replace(_.toLower(newLabel), ' ', '-'),
          })
        }}
        onDelete={(deleteItem) => {
          projects.remove(deleteItem)
        }}
      />
    </Box>
  )
}
