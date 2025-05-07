import React from 'react'
import { Box, Card, CardContent, CardHeader } from '@mui/material'
import { JSONEditor } from '../components/JSONEditor'
import { ProjectHooks } from '@midi-structor/core'

export type SettingsPageProps = {}

export const SettingsPage: React.FC<SettingsPageProps> = ({}) => {
  const arrangement = ProjectHooks.useArrangement()

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
