import React from 'react'
import {Box} from "@mui/material";

export type StatusLedComponentProps = {
  on: boolean
}

export const StatusLedComponent: React.FC<StatusLedComponentProps> = ({
  on
}) => {

  return (
    <Box sx={{
      height: '10px',
      width: '10px',
      borderRadius: '5px',
      border: '1px solid white',
      backgroundColor: on ? 'success.main': ''
    }}></Box>
  )
}
