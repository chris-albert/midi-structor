import React from 'react'
import {
  MidiInput,
  MidiMessageWithRaw,
  Midi,
  ConfiguredControllerHooks,
} from '@midi-structor/core'
import { Box, Button, Card, CardContent, Grid } from '@mui/material'
import _ from 'lodash'
import { MidiMessageDetail } from '../components/MidiMessageDetail'

export type MonitorPageProps = {}

export const MonitorPage: React.FC<MonitorPageProps> = () => {
  const maxMessages = 100

  const dawListener = Midi.useDawListener()
  const controllerListener = ConfiguredControllerHooks.useListeners()
  const [messages, setMessages] = React.useState<
    Array<[MidiMessageWithRaw, number]>
  >([])
  const [totalCount, setTotalCount] = React.useState(0)
  const [listenEnabled, setListenEnabled] = React.useState(false)

  React.useEffect(() => {
    return controllerListener.on('*', (message) => {
      setListenEnabled((enabled) => {
        if (enabled) {
          setTotalCount((count) => {
            // setMessages((m) => _.take([[message, count], ...m], maxMessages))
            return count + 1
          })
        }
        return enabled
      })
    })
  }, [])

  React.useEffect(() => {
    return dawListener.on('*', (message) => {
      setListenEnabled((enabled) => {
        if (enabled) {
          setTotalCount((count) => {
            // setMessages((m) => _.take([[message, count], ...m], maxMessages))
            return count + 1
          })
        }
        return enabled
      })
    })
  }, [])

  return (
    <Box>
      <Box sx={{ mb: 2 }}>
        <Button
          sx={{ mr: 1 }}
          variant='outlined'
          color={listenEnabled ? 'error' : 'success'}
          onClick={() => {
            setListenEnabled((e) => !e)
          }}>
          {listenEnabled ? 'Stop' : 'Listen'}
        </Button>
        <Button
          variant='outlined'
          onClick={() => {
            setTotalCount(0)
            setMessages([])
          }}>
          Clear
        </Button>
      </Box>
      <Card sx={{ mb: 1 }}>
        <CardContent>
          <Grid
            container
            spacing={1}>
            <Grid
              item
              xs={1}>
              #
            </Grid>
            <Grid
              item
              xs={1}>
              Raw Type
            </Grid>
            <Grid
              item
              xs={1}>
              JSON Type
            </Grid>
            <Grid
              item
              xs={9}>
              <Box
                sx={{ display: 'flex', justifyContent: 'flex-start', mr: 5 }}>
                <Box>Values</Box>
              </Box>
            </Grid>
          </Grid>
        </CardContent>
      </Card>
      {_.map(messages, (message, i) => (
        <Box
          key={`midi-message-detail-${i}`}
          sx={{ mb: 1 }}>
          <MidiMessageDetail
            messageNumber={message[1]}
            message={message[0]}
          />
        </Box>
      ))}
    </Box>
  )
}
