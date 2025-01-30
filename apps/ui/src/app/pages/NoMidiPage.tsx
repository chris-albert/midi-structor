import React from 'react'
import {Box, Typography} from "@mui/material";

export type NoMidiPageProps = {}

export const NoMidiPage: React.FC<NoMidiPageProps> = ({}) => {

    return (
      <Box sx={{m: 2}}>
        <Typography variant='h4'>
          MIDI not enabled in this browser please allow MIDI for this page.
        </Typography>
      </Box>
    )
}
