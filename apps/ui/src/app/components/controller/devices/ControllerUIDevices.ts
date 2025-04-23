import { ControllerUIDevice } from './ControllerUIDevice'
import { Option } from 'effect'
import { LaunchPadMiniMk3UI } from './LaunchPadMiniMk3UI'
import _ from 'lodash'
import { MIDIStructorDeviceUI } from './midistructor/MIDIStructorDeviceUI'

const all: Array<ControllerUIDevice<any>> = [LaunchPadMiniMk3UI, MIDIStructorDeviceUI]

const lookup: Record<string, ControllerUIDevice<any>> = _.keyBy(all, (d) => d.controller.name)

const findByName = (name: string): Option.Option<ControllerUIDevice<any>> =>
  Option.fromNullable(_.get(lookup, name, undefined))

export const ControllerUIDevices = {
  findByName,
}
