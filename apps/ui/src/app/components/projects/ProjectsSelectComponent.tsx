import React from 'react'
import { Box } from '@mui/material'
import { SelectComponent, SelectItem } from '../SelectComponent'
import _ from 'lodash'
import { ProjectConfig, ProjectHooks } from '@midi-structor/core'

export type ProjectsSelectComponentProps = {}

export const ProjectsSelectComponent: React.FC<ProjectsSelectComponentProps> = ({}) => {
  const [projectsConfig] = ProjectHooks.useProjectsConfig()
  const setActiveProject = ProjectHooks.useSetActiveProject()

  const [items, setItems] = React.useState<Array<SelectItem<ProjectConfig>>>([])
  const activeProjectLabel = ProjectHooks.useActiveProjectLabel()
  const projects = ProjectHooks.useProjectsListAtom()

  React.useEffect(() => {
    setItems(
      _.map(projectsConfig.projects, (p) => ({
        label: p.label,
        value: p,
      }))
    )
  }, [projectsConfig])

  const onProjectSelect = (input: ProjectConfig | undefined) => {
    if (input !== undefined) {
      setActiveProject(input.key)
    }
  }

  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
      }}>
      <SelectComponent
        label='Project'
        items={items}
        onChange={onProjectSelect}
        activeLabel={activeProjectLabel}
        onNew={(newLabel) => {
          projects.add({
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
