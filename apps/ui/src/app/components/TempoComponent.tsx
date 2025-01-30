import React from 'react'
import {Box, Typography} from "@mui/material";
import {useTempo} from "../hooks/RealTimeHooks";

export type TempoComponentProps = {}

export const TempoComponent: React.FC<TempoComponentProps> = ({}) => {

  const tempo = useTempo()

  return (
    <Box
      sx={{
        height: 100,
        width: '100%'
      }}
    >
      <Typography variant="h1" align='center'>
        {tempo}
      </Typography>
    </Box>
  )
}
