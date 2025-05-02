import React from 'react'
import IconButton from "@mui/material/IconButton";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import {Box} from "@mui/material";

export type PlayButtonComponentProps = {
  onPlay: () => void
}

export const PlayButtonComponent: React.FC<PlayButtonComponentProps> = ({
  onPlay
}) => {

  return (
    <Box
      sx={{
        borderRadius: '5px',
        backgroundColor: 'success.main'
      }}
    >
      <IconButton
        sx={{
          width: 100,
          height: 100,
        }}
        aria-label="play"
        onClick={onPlay}
      >
        <PlayArrowIcon sx={{ fontSize: 80 }}/>
      </IconButton>
    </Box>
  )
}
