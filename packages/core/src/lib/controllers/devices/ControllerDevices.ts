import _ from 'lodash'
import { LaunchPadMiniMk3 } from './LaunchPadMiniMk3'
import { MIDIStructorUI } from './MIDIStructorUI'
import { ControllerDevice } from './ControllerDevice'
import { Option } from 'effect'

const allDevices: Array<ControllerDevice> = [
  LaunchPadMiniMk3.device,
  MIDIStructorUI.device,
]

const deviceLookup: Record<string, ControllerDevice> = _.keyBy(
  allDevices,
  'name'
)

const defaultDevice: ControllerDevice = LaunchPadMiniMk3.device

const findByName = (name: string): Option.Option<ControllerDevice> =>
  Option.fromNullable(_.get(deviceLookup, name, undefined))

const getNames = () => _.map(allDevices, 'name')

export const ControllerDevices = {
  defaultDevice,
  findByName,
  getNames,
}
