import { ControllerUIDevice } from './ControllerUIDevice'
import { Option } from 'effect'
import _ from 'lodash'

export type ControllerUIDevices = {
  findByName: (name: string) => Option.Option<ControllerUIDevice<any, any>>
  getByName: (name: string) => ControllerUIDevice<any, any>
}

const emptyDevices: ControllerUIDevices = {
  findByName: (name: string) => Option.none(),
  getByName: (name: string) => ControllerUIDevice.emptyDevice,
}

let DEVICES: ControllerUIDevices = emptyDevices
const init = (all: Array<ControllerUIDevice<any, any>>) => {
  const lookup: Record<string, ControllerUIDevice<any, any>> = _.keyBy(
    all,
    (d) => d.controller.name
  )

  const findByName = (
    name: string
  ): Option.Option<ControllerUIDevice<any, any>> =>
    Option.fromNullable(_.get(lookup, name, undefined))

  const getByName = (name: string): ControllerUIDevice<any, any> =>
    Option.match(findByName(name), {
      onSome: (d) => d,
      onNone: () => ControllerUIDevice.emptyDevice,
    })
  DEVICES = { findByName, getByName }
}

const get = () => DEVICES
const useDevices = () => DEVICES

export const ControllerUIDevices = { init, useDevices, get }
