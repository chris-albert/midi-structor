import React from 'react'
import {Box} from "@mui/material";
import {SpacerWidget} from "../../model/Widgets";

export type SpacerWidgetComponentProps = {
  widget: SpacerWidget
}

export const SpacerWidgetComponent: React.FC<SpacerWidgetComponentProps> = ({widget}) => {

  return (
    <Box sx={{width: `${widget.width}px`}} />
  )
}
