import React from 'react'
import {
  ControllerConfigOps,
  ProjectConfig,
  ProjectHooks,
} from '@midi-structor/core'
import { Box, Button, Card, CardContent, CardHeader } from '@mui/material'
import { toast } from 'react-toastify'
import { JSONEditor } from '../JSONEditor'
import { Either } from 'effect'

export type ProjectSettingsRawComponentProps = {}

export const ProjectSettingsRawComponent: React.FC<
  ProjectSettingsRawComponentProps
> = ({}) => {
  const project = ProjectHooks.useActiveProjectValue()
  const updateProject = ProjectHooks.useUpdateActiveProject()
  const [rawProjectConfig, setRawProjectConfig] = React.useState('')
  const projectStyle = ProjectHooks.useProjectStyle()

  React.useEffect(() => {
    setRawProjectConfig(ProjectConfig.stringify(project))
  }, [project])

  const onSave = () => {
    // Either.match(ProjectConfig.parse(rawProjectConfig), {
    //   onRight: (config) => {
    //     toast.success('Successfully saved config')
    //   },
    //   onLeft: (error) =>
    //     toast.error(`Error while saving controller config: ${error}`),
    // })
  }

  return (
    <Card
      sx={{
        p: 2,
        minWidth: '500px',
      }}>
      <CardHeader
        title='Project Settings'
        sx={{
          background: projectStyle.horizontalGradient,
        }}
        action={
          <Button
            onClick={onSave}
            variant='outlined'
            sx={{
              mixBlendMode: 'difference',
            }}
            size='small'>
            Save
          </Button>
        }
      />
      <CardContent>
        <JSONEditor
          height='500px'
          readonly={false}
          onChange={setRawProjectConfig}
          value={rawProjectConfig}
        />
      </CardContent>
    </Card>
  )
}
