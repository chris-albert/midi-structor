import React from 'react'
import { ConfiguredController, ControllerConfig, JsonUtil } from '@midi-structor/core'
import { PrimitiveAtom } from 'jotai/index'
import { Box, Button, Card, CardContent, CardHeader } from '@mui/material'
import { JSONEditor } from '../JSONEditor'
import { Either, Schema } from 'effect'
import { toast } from 'react-toastify'

export type ControllerEditRawComponentProps = {
  controllerAtom: PrimitiveAtom<ConfiguredController>
}

export const ControllerEditRawComponent: React.FC<ControllerEditRawComponentProps> = ({ controllerAtom }) => {
  const controller = ConfiguredController.useController(controllerAtom)
  const [rawControllerConfig, setRawControllerConfig] = React.useState('')

  React.useEffect(() => {
    setRawControllerConfig(JSON.stringify(controller.config, null, 2))
  }, [controller.config])

  const onSave = () => {
    Either.match(JsonUtil.parseSchema(rawControllerConfig, ControllerConfig.Schema), {
      onRight: (config) => {
        controller.setConfig(config)
        toast.success('Successfully saved config')
      },
      onLeft: (error) => toast.error(`Error while saving controller config: ${error}`),
    })
  }

  return (
    <Box sx={{ pt: 1, display: 'flex' }}>
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
    </Box>
  )
}
