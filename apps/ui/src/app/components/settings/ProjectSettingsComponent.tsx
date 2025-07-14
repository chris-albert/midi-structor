import React from 'react'
import {
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  Chip,
  Divider,
  TextField,
  Typography,
} from '@mui/material'
import { ProjectHooks } from '@midi-structor/core'
import { MuiColorInput } from 'mui-color-input'
import { SaveableTextFieldComponent } from '../form/SaveableTextFieldComponent'
import { useNavigate } from 'react-router-dom'

export type ProjectSettingsComponentProps = {}

export const ProjectSettingsComponent: React.FC<
  ProjectSettingsComponentProps
> = ({}) => {
  const project = ProjectHooks.useActiveProjectValue()
  const updateProject = ProjectHooks.useUpdateActiveProject()
  const projectStyle = ProjectHooks.useProjectStyle()
  const abletonProject = ProjectHooks.useAbletonProjectName()
  const updateProjectName = ProjectHooks.useSetActiveProjectName()
  const navigate = useNavigate()

  const onAbletonSelect = () => {
    updateProject((p) => ({
      ...p,
      abletonProject,
    }))
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
          <SaveableTextFieldComponent
            label='Project Name'
            initialValue={project.label}
            onSave={updateProjectName}
          />
          <Typography variant='h6'>Ableton Project</Typography>
          <Divider />
          {abletonProject !== undefined &&
          abletonProject !== project.abletonProject ? (
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
          {project.abletonProject !== undefined ? (
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
              }}>
              <Typography>Load with Ableton project: </Typography>
              <Chip
                sx={{
                  ml: 1,
                  background: projectStyle.horizontalGradient,
                }}
                label={project.abletonProject}
                variant='outlined'
                onDelete={() => {
                  updateProject((p) => ({
                    ...p,
                    abletonProject: undefined,
                  }))
                }}
              />
            </Box>
          ) : null}
          <Typography variant='h6'>Style</Typography>
          <Divider />
          <MuiColorInput
            label='Accent Color 1'
            size='small'
            format='hex'
            value={projectStyle.accent.color1}
            onChange={(n, c) => {
              updateProject((p) => ({
                ...p,
                style: {
                  accent: {
                    ...projectStyle.accent,
                    color1: n,
                  },
                },
              }))
            }}
          />
          <MuiColorInput
            label='Accent Color 2'
            size='small'
            format='hex'
            value={projectStyle.accent.color2}
            onChange={(n, c) => {
              updateProject((p) => ({
                ...p,
                style: {
                  accent: {
                    ...projectStyle.accent,
                    color2: n,
                  },
                },
              }))
            }}
          />
          {/*<Divider />*/}
          {/*<Button*/}
          {/*  size='small'*/}
          {/*  sx={{*/}
          {/*    background: projectStyle.horizontalGradient,*/}
          {/*  }}*/}
          {/*  onClick={() => {*/}
          {/*    navigate('/settings/project')*/}
          {/*  }}*/}
          {/*  variant='contained'>*/}
          {/*  Edit Raw*/}
          {/*</Button>*/}
        </Box>
      </CardContent>
    </Card>
  )
}
