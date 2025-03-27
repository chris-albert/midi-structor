import _ from 'lodash'
import { LaunchPadMiniMk3 } from './LaunchPadMiniMk3'
import { ControllerDevice } from './ControllerDevice'
import { Option } from 'effect'
import { MIDIStructorUI } from './MIDIStructorUI'

const allDevices: Array<ControllerDevice> = [LaunchPadMiniMk3, MIDIStructorUI]

const deviceLookup: Record<string, ControllerDevice> = _.keyBy(allDevices, 'name')

const defaultDevice: ControllerDevice = LaunchPadMiniMk3

const findByName = (name: string): Option.Option<ControllerDevice> =>
  Option.fromNullable(_.get(deviceLookup, name, undefined))

const getNames = () => _.map(allDevices, 'name')

export const ControllerDevices = {
  defaultDevice,
  findByName,
  getNames,
}
