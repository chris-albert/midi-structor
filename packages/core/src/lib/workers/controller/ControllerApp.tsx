import React from 'react'
import { MidiRenderer } from '../../renderer/MidiRenderer'
import { ControllerComponent } from '../../controllers/ControllerComponent'
import { ConfiguredController } from '../../controllers/ConfiguredController'
import { ConfiguredControllerIO } from '../../controllers/ConfiguredControllerHooks'

export const ControllerApp = (
  controller: ConfiguredController,
  io: ConfiguredControllerIO
) => {
  MidiRenderer.render(
    <ControllerComponent
      controller={controller}
      io={io}
    />
  )
}
