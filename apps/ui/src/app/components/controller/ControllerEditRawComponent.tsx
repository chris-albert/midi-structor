import React from 'react'
import { ConfiguredController, ControllerConfig, ControllerDevice } from '@midi-structor/core'
import { PrimitiveAtom } from 'jotai/index'
import { Button, Card, CardContent, CardHeader } from '@mui/material'
import { JSONEditor } from '../JSONEditor'
import { Either, Schema, Option } from 'effect'
import { toast } from 'react-toastify'

export type ControllerEditRawComponentProps = {
  controllerAtom: PrimitiveAtom<ConfiguredController>
  device: ControllerDevice
}

export const ControllerEditRawComponent: React.FC<ControllerEditRawComponentProps> = ({
  controllerAtom,
  device,
}) => {
  const controller = ConfiguredController.useController(controllerAtom)
  const [rawControllerConfig, setRawControllerConfig] = React.useState('')

  React.useEffect(() => {
    Option.match(Schema.encodeOption(ControllerConfig.Schema)(controller.config), {
      onSome: (c) => setRawControllerConfig(JSON.stringify(c, null, 2)),
      onNone: () => setRawControllerConfig('Error decoding controller config'),
    })
  }, [controller.config])

  const onSave = () => {
    Either.match(ControllerConfig.parse(rawControllerConfig, device), {
      onRight: (config) => {
        controller.setConfig(config)
        toast.success('Successfully saved config')
      },
      onLeft: (error) => toast.error(`Error while saving controller config: ${error}`),
    })
  }

  return (
    <Card>
      <CardHeader
        action={
          <Button
            onClick={onSave}
            variant='outlined'
            size='small'>
            Save
          </Button>
        }
        title='Raw Config'
      />
      <CardContent>
        <JSONEditor
          height='800px'
          readonly={false}
          onChange={setRawControllerConfig}
          value={rawControllerConfig}
        />
      </CardContent>
    </Card>
  )
}
