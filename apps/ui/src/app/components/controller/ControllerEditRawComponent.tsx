import React from 'react'
import {
  ConfiguredController,
  ConfiguredControllerHooks,
  ControllerConfig,
  ControllerDevice,
  ProjectHooks,
  State,
} from '@midi-structor/core'
import { Button, Card, CardContent, CardHeader } from '@mui/material'
import { JSONEditor } from '../JSONEditor'
import { Either } from 'effect'
import { toast } from 'react-toastify'

export type ControllerEditRawComponentProps = {
  controllerState: State<ConfiguredController>
  device: ControllerDevice
}

export const ControllerEditRawComponent: React.FC<
  ControllerEditRawComponentProps
> = ({ controllerState, device }) => {
  const controller = ConfiguredControllerHooks.useController(controllerState)
  const [rawControllerConfig, setRawControllerConfig] = React.useState('')
  const projectStyle = ProjectHooks.useProjectStyle()

  React.useEffect(() => {
    setRawControllerConfig(
      ControllerConfig.stringify(controller.config, device)
    )
  }, [controller.config])

  const onSave = () => {
    Either.match(ControllerConfig.parse(rawControllerConfig, device), {
      onRight: (config) => {
        controller.setConfig(config)
        toast.success('Successfully saved config')
      },
      onLeft: (error) =>
        toast.error(`Error while saving controller config: ${error}`),
    })
  }

  return (
    <Card>
      <CardHeader
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
        title='Raw Config'
      />
      <CardContent>
        <JSONEditor
          height='500px'
          readonly={false}
          onChange={setRawControllerConfig}
          value={rawControllerConfig}
        />
      </CardContent>
    </Card>
  )
}
