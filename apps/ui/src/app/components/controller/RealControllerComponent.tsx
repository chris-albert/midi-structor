import React from 'react'
import { Box } from '@mui/material'
import { ControllerMidiComponent } from '../midi/ControllerMidiComponent'
import { PrimitiveAtom } from 'jotai/index'
import { RealConfiguredController } from '@midi-structor/core'

export type RealControllerComponentProps = {
  controllerAtom: PrimitiveAtom<RealConfiguredController>
}

export const RealControllerComponent: React.FC<RealControllerComponentProps> = ({ controllerAtom }) => {
  return (
    <Box>
      <ControllerMidiComponent controllerAtom={controllerAtom} />
    </Box>
  )
}
