import React from 'react'
import {
  MidiInput,
  MidiMessage,
  DawMidi,
  ConfiguredControllerHooks,
  parseAbletonUIMessage,
} from '@midi-structor/core'
import { Box, Button, Card, CardContent, Chip, Grid } from '@mui/material'
import _ from 'lodash'
import { MidiMessageDetail } from '../components/MidiMessageDetail'

export type MonitorPageProps = {}

export const MonitorPage: React.FC<MonitorPageProps> = () => {
  const maxMessages = 500

  const dawListener = DawMidi.useDawListener()
  const controllerListener = ConfiguredControllerHooks.useListeners()
  const [messages, setMessages] = React.useState<Array<[MidiMessage, number]>>(
    []
  )
  const [totalCount, setTotalCount] = React.useState(0)

  const [initTrackCount, setInitTrackCount] = React.useState(0)
  const [initClipCount, setInitClipCount] = React.useState(0)
  const [initCueCount, setInitCueCount] = React.useState(0)
  const [midiStructorMessageCounts, setMidiStructorMessageCount] =
    React.useState<Record<string, number>>({})

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
            setMessages((m) => _.take([[message, count], ...m], maxMessages))
            if (message.type === 'sysex') {
              const json = parseAbletonUIMessage(message)
              if (json !== undefined) {
                setMidiStructorMessageCount((m) => ({
                  ...m,
                  [json.type]: (m[json.type] || 0) + 1,
                }))
              }
            }
            return count + 1
          })
        }
        return enabled
      })
    })
  }, [])

  return (
    <Box>
      <Box
        sx={{
          mb: 2,
          display: 'flex',
          gap: 1,
        }}>
        <Button
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
            setMidiStructorMessageCount({})
          }}>
          Clear
        </Button>
        <Box
          sx={{
            display: 'flex',
            gap: 1,
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          {_.map(midiStructorMessageCounts, (messageCount, messageType) => (
            <Box key={messageType}>
              <Chip label={`${messageType}: ${messageCount}`} />
            </Box>
          ))}
        </Box>
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
