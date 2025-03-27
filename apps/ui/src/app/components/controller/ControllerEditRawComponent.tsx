import React from 'react'
import { ConfiguredController, ControllerConfig } from '@midi-structor/core'
import { PrimitiveAtom } from 'jotai/index'
import { Box, Button, Card, CardContent, CardHeader } from '@mui/material'
import { JSONEditor } from '../JSONEditor'
import { Either, Schema, Option } from 'effect'
import { toast } from 'react-toastify'
import { ControllerMidiComponent } from '../midi/ControllerMidiComponent'
import { DeviceSelectorComponent } from './DeviceSelectorComponent'
import DeleteIcon from '@mui/icons-material/Delete'

export type ControllerEditRawComponentProps = {
  controllerAtom: PrimitiveAtom<ConfiguredController>
}

export const ControllerEditRawComponent: React.FC<ControllerEditRawComponentProps> = ({ controllerAtom }) => {
  const controller = ConfiguredController.useController(controllerAtom)
  const [rawControllerConfig, setRawControllerConfig] = React.useState('')

  React.useEffect(() => {
    Option.match(Schema.encodeOption(ControllerConfig.Schema)(controller.config), {
      onSome: (c) => setRawControllerConfig(JSON.stringify(c, null, 2)),
      onNone: () => setRawControllerConfig('Error decoding controller config'),
    })
  }, [controller.config])

  const onSave = () => {
    Either.match(ControllerConfig.parse(rawControllerConfig), {
      onRight: (config) => {
        controller.setConfig(config)
        toast.success('Successfully saved config')
      },
      onLeft: (error) => toast.error(`Error while saving controller config: ${error}`),
    })
  }

  return (
    <Box sx={{ pt: 1, display: 'flex', gap: 2 }}>
      <Box sx={{ width: '50%', display: 'flex', flexDirection: 'column', gap: 2 }}>
        <DeviceSelectorComponent controllerAtom={controllerAtom} />
        <ControllerMidiComponent controllerAtom={controllerAtom} />
        <Box>
          <Button
            variant='contained'
            color='error'
            endIcon={<DeleteIcon />}
            onClick={controller.remove}>
            Delete Controller
          </Button>
        </Box>
      </Box>
      <Box sx={{ width: '50%' }}>
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
    </Box>
  )
}
