import { Controller } from '../Controller'
import { ControllerWidgets } from '../ControllerWidgets'
import { ControllerWidget } from '../ControllerWidget'

export type ControllerDevice<Widgets extends Array<ControllerWidget> = any> = {
  name: string
  controller: Controller
  widgets: ControllerWidgets<Widgets>
}

const of = <Widgets extends Array<ControllerWidget>>(
  device: ControllerDevice<Widgets>
): ControllerDevice<Widgets> => device

const empty: ControllerDevice<[]> = {
  name: 'empty',
  controller: Controller.empty,
  widgets: ControllerWidgets([]),
}

export const ControllerDevice = {
  of,
  empty,
}
