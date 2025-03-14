import React from 'react'
import { ConfiguredController } from '@midi-structor/core'
import { PrimitiveAtom } from 'jotai/index'
import { Box, Button, Card, CardContent, CardHeader } from '@mui/material'
import { JSONEditor } from '../JSONEditor'

export type ControllerEditRawComponentProps = {
  controllerAtom: PrimitiveAtom<ConfiguredController>
}

export const ControllerEditRawComponent: React.FC<ControllerEditRawComponentProps> = ({ controllerAtom }) => {
  const [rawControllerConfig, setRawControllerConfig] = React.useState('')

  const onSave = () => {}

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
