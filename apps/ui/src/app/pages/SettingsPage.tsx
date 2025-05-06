import React from 'react'
import { Box, Card, CardContent, CardHeader } from '@mui/material'
import { JSONEditor } from '../components/JSONEditor'
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

  const onProjectsSave = () => {
    const json = E.tryCatch(
      () => JSON.parse(rawProjects),
      (e) => e
    )
    const res = E.flatMap(json, ProjectsConfig.decode)
    E.match<any, ProjectsConfig, void>(
      (err: any) => {
        toast.error(
          'Invalid Projects: ' + PathReporter.report(E.left(err)).join(', ')
        )
      },
      (projects) => {
        setProjects(projects)
        toast.success('Projects saved')
      }
    )(res)
  }

  return (
    <Box
      sx={{
        display: 'flex',
        p: 2,
        gap: 2,
      }}>
      {/*<Card>*/}
      {/*  <CardHeader*/}
      {/*    title='Projects'*/}
      {/*    action={*/}
      {/*      <Button*/}
      {/*        onClick={onProjectsSave}*/}
      {/*        variant='outlined'*/}
      {/*        size='small'>*/}
      {/*        Save*/}
      {/*      </Button>*/}
      {/*    }*/}
      {/*  />*/}
      {/*  <CardContent>*/}
      {/*    <JSONEditor*/}
      {/*      height='800px'*/}
      {/*      value={rawProjects}*/}
      {/*      readonly={false}*/}
      {/*      onChange={setRawProjects}*/}
      {/*    />*/}
      {/*  </CardContent>*/}
      {/*</Card>*/}
      <Card>
        <CardHeader title='Arrangement' />
        <CardContent>
          <JSONEditor
            height='800px'
            value={JSON.stringify(arrangement, null, 2)}
          />
        </CardContent>
      </Card>
    </Box>
  )
}
