import React from 'react'
import { Box, Button, Card, CardContent, CardHeader, Typography } from '@mui/material'
import { JSONEditor } from '../components/JSONEditor'
import { Widgets } from '../model/Widgets'
import * as E from 'fp-ts/Either'
import { toast } from 'react-toastify'
import { PathReporter } from 'io-ts/lib/PathReporter'
import { ProjectHooks, ProjectsConfig } from '@midi-structor/core'
import { UIWidgets } from '../hooks/UIWidgets'

export type SettingsPageProps = {}

export const SettingsPage: React.FC<SettingsPageProps> = ({}) => {
  const arrangement = ProjectHooks.useArrangement()
  const [widgets, setWidgets] = UIWidgets.useWidgets()
  const [projects, setProjects] = ProjectHooks.useProjectsConfig()

  const [rawWidgets, setRawWidgets] = React.useState('')
  const [rawProjects, setRawProjects] = React.useState('')

  React.useEffect(() => {
    setRawWidgets(JSON.stringify(widgets, null, 2))
  }, [widgets])

  React.useEffect(() => {
    setRawProjects(JSON.stringify(projects, null, 2))
  }, [projects])

  const onWidgetsSave = () => {
    const json = E.tryCatch(
      () => JSON.parse(rawWidgets),
      (e) => e,
    )
    const res = E.flatMap(json, Widgets.decode)
    E.match<any, Widgets, void>(
      (err: any) => {
        console.log('widgets error', err)
        toast.error('Invalid widgets: ' + PathReporter.report(E.left(err)).join(', '))
      },
      (widgets) => {
        setWidgets(widgets)
        toast.success('Widgets saved')
      },
    )(res)
  }

  const onProjectsSave = () => {
    const json = E.tryCatch(
      () => JSON.parse(rawProjects),
      (e) => e,
    )
    const res = E.flatMap(json, ProjectsConfig.decode)
    E.match<any, ProjectsConfig, void>(
      (err: any) => {
        toast.error('Invalid Projects: ' + PathReporter.report(E.left(err)).join(', '))
      },
      (projects) => {
        setProjects(projects)
        toast.success('Projects saved')
      },
    )(res)
  }

  return (
    <Box
      sx={{
        display: 'flex',
        p: 2,
        gap: 2,
      }}>
      <Card>
        <CardHeader
          title='Projects'
          action={
            <Button
              onClick={onProjectsSave}
              variant='outlined'
              size='small'>
              Save
            </Button>
          }
        />
        <CardContent>
          <JSONEditor
            height='800px'
            value={rawProjects}
            readonly={false}
            onChange={setRawProjects}
          />
        </CardContent>
      </Card>
      <Card>
        <CardHeader title='Arrangement' />
        <CardContent>
          <JSONEditor
            height='800px'
            value={JSON.stringify(arrangement, null, 2)}
          />
        </CardContent>
      </Card>
      <Card>
        <CardHeader
          action={
            <Button
              onClick={onWidgetsSave}
              variant='outlined'
              size='small'>
              Save
            </Button>
          }
          title='Widgets'
        />
        <CardContent>
          <JSONEditor
            height='800px'
            readonly={false}
            onChange={setRawWidgets}
            value={rawWidgets}
          />
        </CardContent>
      </Card>
    </Box>
  )
}
