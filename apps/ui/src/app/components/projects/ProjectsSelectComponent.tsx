import React from 'react'
import { Box } from '@mui/material'
import { SelectComponent, SelectItem } from '../SelectComponent'
import _ from 'lodash'
import { ProjectHooks } from '@midi-structor/core'

export type ProjectsSelectComponentProps = {}

export const ProjectsSelectComponent: React.FC<ProjectsSelectComponentProps> = ({}) => {
  const [projectsConfig] = ProjectHooks.useProjectsConfig()
  const setActiveProject = ProjectHooks.useSetActiveProject()

  const [items, setItems] = React.useState<Array<SelectItem<string>>>([])
  const activeProjectLabel = ProjectHooks.useActiveProjectLabel()

  React.useEffect(() => {
    setItems(
      _.map(projectsConfig.projects, (p, key) => ({
        label: p.name,
        value: key,
      }))
    )
  }, [projectsConfig])

  const onProjectSelect = (input: string | undefined) => {
    if (input !== undefined) {
      setActiveProject(input)
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
          console.log('add new label', newLabel)
        }}
        onDelete={(deleteLabel) => {}}
      />
    </Box>
  )
}
