import React from 'react'
import { MidiMessageWithRaw } from '@midi-structor/core'
import {
  Box,
  Grid,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Typography,
  Divider,
  Chip,
} from '@mui/material'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import { JSONEditor } from './JSONEditor'
import { parseAbletonUIMessage } from '@midi-structor/core'
import _ from 'lodash'

const renderRawAsInt = (raw: Uint8Array): string => {
  return `[${raw.join(', ')}]`
}
const renderRawAsHex = (raw: Uint8Array): string => {
  const arr: Array<string> = []
  raw.forEach((value) => arr.push(value.toString(16)))
  return `[${arr.join(', ')}]`
}

export type MidiMessageDetailProps = {
  message: MidiMessageWithRaw
  messageNumber: number
}

export const MidiMessageDetail: React.FC<MidiMessageDetailProps> = ({
  message,
  messageNumber,
}) => {
  let detail = <Box>Unknown</Box>

  let jsonType = <Box></Box>

  let values = <Box></Box>

  if (message.type === 'sysex') {
    try {
      const json = parseAbletonUIMessage(message)
      if (json !== undefined) {
        console.log('json message', json)

        detail = (
          <JSONEditor
            height={json.type === 'beat' ? '100px' : '500px'}
            value={JSON.stringify(json, null, 2)}
          />
        )
        jsonType = <Box>{json.type}</Box>
        if (json.type === 'beat') {
          values = (
            <Box>
              <Chip
                color='info'
                size='small'
                label={json.value}
              />
            </Box>
          )
        } else if (json.type === 'bar-beat') {
          values = (
            <Box>
              <Chip
                color='info'
                size='small'
                label={json.value}
              />
            </Box>
          )
        } else if (json.type === 'sig') {
          values = (
            <Box>
              <Chip
                color='info'
                size='small'
                label={`${json.numer}/${json.denom}`}
              />
            </Box>
          )
        } else if (json.type === 'tempo') {
          values = (
            <Box>
              <Chip
                color='info'
                size='small'
                label={json.value}
              />
            </Box>
          )
        }
      }
    } catch (e) {
      detail = <Box>Unable to parse JSON, raw sysex data [{message.raw}]</Box>
    }
  } else if (message.type === 'noteon' || message.type === 'noteoff') {
    values = (
      <Box>
        <Chip
          sx={{ mr: 1 }}
          color='info'
          size='small'
          label={`Channel: ${message.channel}`}
        />
        <Chip
          sx={{ mr: 1 }}
          color='info'
          size='small'
          label={`Note: ${message.note}`}
        />
        <Chip
          color='info'
          size='small'
          label={`Velocity: ${message.velocity}`}
        />
      </Box>
    )
  } else if (message.type === 'unknown') {
    detail = <Box>Unable to parse JSON </Box>
  }

  return (
    <Box>
      <Accordion>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls='panel1a-content'
          id='panel1a-header'>
          <Grid
            container
            spacing={1}>
            <Grid
              item
              xs={1}>
              <Chip
                size='small'
                label={messageNumber}
              />
            </Grid>
            <Grid
              item
              xs={1}>
              <Chip
                color='primary'
                size='small'
                label={message.type}
              />
            </Grid>
            <Grid
              item
              xs={1}>
              <Chip
                color='success'
                size='small'
                label={jsonType}
              />
            </Grid>
            <Grid
              item
              xs={9}>
              <Box
                sx={{ display: 'flex', justifyContent: 'flex-start', mr: 2 }}>
                {values}
              </Box>
            </Grid>
          </Grid>
        </AccordionSummary>
        <Divider />
        <AccordionDetails>
          {detail}
          <Box>Raw Int: {renderRawAsInt(message.raw)}</Box>
          <Box>RawHex: {renderRawAsHex(message.raw)}</Box>
        </AccordionDetails>
      </Accordion>
    </Box>
  )
}
