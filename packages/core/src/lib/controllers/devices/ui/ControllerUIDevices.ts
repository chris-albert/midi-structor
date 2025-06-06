import { ControllerUIDevice } from './ControllerUIDevice'
import { Option } from 'effect'
import _ from 'lodash'
import { atom, getDefaultStore, useAtomValue } from 'jotai'

const store = getDefaultStore()

export type ControllerUIDevices = {
  findByName: (name: string) => Option.Option<ControllerUIDevice<any, any>>
  getByName: (name: string) => ControllerUIDevice<any, any>
}

const emptyDevices: ControllerUIDevices = {
  findByName: (name: string) => Option.none(),
  getByName: (name: string) => ControllerUIDevice.emptyDevice,
}

const devicesAtom = atom<ControllerUIDevices>(emptyDevices)

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

  store.set(devicesAtom, { findByName, getByName })
}

const useDevices = () => useAtomValue(devicesAtom)

export const ControllerUIDevices = { init, useDevices }
