import React from 'react'
import IconButton from "@mui/material/IconButton";
import {Box} from "@mui/material";
import StopIcon from '@mui/icons-material/Stop';

export type StopButtonComponentProps = {
  onStop: () => void
}

export const StopButtonComponent: React.FC<StopButtonComponentProps> = ({
  onStop
}) => {

  return (
    <Box
      sx={{
        borderRadius: '5px',
        backgroundColor: 'error.main'
      }}
    >
      <IconButton
        sx={{
          width: 100,
          height: 100,
        }}
        aria-label="play"
        onClick={onStop}
      >
        <StopIcon sx={{ fontSize: 80 }}/>
      </IconButton>
    </Box>
  )
}
