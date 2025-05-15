import React from 'react'
import {
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  Divider,
  TextField,
  Typography,
} from '@mui/material'
import { ProjectHooks } from '@midi-structor/core'
import { MuiColorInput } from 'mui-color-input'

export type ProjectSettingsComponentProps = {}

export const ProjectSettingsComponent: React.FC<
  ProjectSettingsComponentProps
> = ({}) => {
  const project = ProjectHooks.useActiveProjectValue()
  const updateProject = ProjectHooks.useUpdateActiveProject()
  const projectStyle = ProjectHooks.useProjectStyle()
  const abletonProject = ProjectHooks.useAbletonProjectName()

  const onAbletonSelect = () => {
    updateProject({
      ...project,
      abletonProject,
    })
  }

  return (
    <Card
      sx={{
        minWidth: '500px',
      }}>
      <CardHeader
        title='Project Settings'
        sx={{
          background: projectStyle.horizontalGradient,
        }}
      />
      <CardContent>
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            gap: 2,
          }}>
          <Typography variant='h6'>General</Typography>
          <Divider />
          <TextField
            label='Project Name'
            variant='outlined'
            fullWidth
            size='small'
            value={project.label}
            onChange={(e) =>
              updateProject({
                ...project,
                label: e.target.value,
              })
            }
          />
          {abletonProject !== undefined ? (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Typography>Current Ableton project: {abletonProject}</Typography>
              <Button
                size='small'
                sx={{
                  background: projectStyle.horizontalGradient,
                }}
                onClick={onAbletonSelect}
                variant='contained'>
                Load with this
              </Button>
            </Box>
          ) : null}
          <TextField
            label='Load with Ableton project'
            variant='outlined'
            fullWidth
            size='small'
            value={project.abletonProject || ''}
            onChange={(e) =>
              updateProject({
                ...project,
                abletonProject: e.target.value,
              })
            }
          />
          <Typography variant='h6'>Style</Typography>
          <Divider />
          <MuiColorInput
            label='Accent Color 1'
            size='small'
            format='hex'
            value={projectStyle.accent.color1}
            onChange={(n, c) => {
              updateProject({
                ...project,
                style: {
                  accent: {
                    ...projectStyle.accent,
                    color1: n,
                  },
                },
              })
            }}
          />
          <MuiColorInput
            label='Accent Color 2'
            size='small'
            format='hex'
            value={projectStyle.accent.color2}
            onChange={(n, c) => {
              updateProject({
                ...project,
                style: {
                  accent: {
                    ...projectStyle.accent,
                    color2: n,
                  },
                },
              })
            }}
          />
        </Box>
      </CardContent>
    </Card>
  )
}
