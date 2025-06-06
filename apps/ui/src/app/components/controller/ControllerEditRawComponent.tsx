import React from 'react'
import {
  ConfiguredController,
  ControllerConfig,
  ControllerDevice,
  ProjectHooks,
} from '@midi-structor/core'
import { PrimitiveAtom } from 'jotai/index'
import { Button, Card, CardContent, CardHeader } from '@mui/material'
import { JSONEditor } from '../JSONEditor'
import { Either } from 'effect'
import { toast } from 'react-toastify'

export type ControllerEditRawComponentProps = {
  controllerAtom: PrimitiveAtom<ConfiguredController>
  device: ControllerDevice
}

export const ControllerEditRawComponent: React.FC<
  ControllerEditRawComponentProps
> = ({ controllerAtom, device }) => {
  const controller = ConfiguredController.useController(controllerAtom)
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
