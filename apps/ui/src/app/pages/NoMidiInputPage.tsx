import React from 'react'
import {Box, Typography} from "@mui/material";

export type NoMidiInputPageProps = {}

export const NoMidiInputPage: React.FC<NoMidiInputPageProps> = ({}) => {

    return (
        <Box sx={{m: 2}}>
            <Typography variant='h4'>
                No MIDI input selected. Please select one from the above dropdown.
            </Typography>

        </Box>
    )
}
