import { MIDIStructorWidget, OnClick } from './MIDIStructorWidget'
import _ from 'lodash'
import React from 'react'
import { MIDIStructorPad, MIDIStructorStore } from '../MIDIStructorUI'
import { MidiTarget } from '../../../midi/MidiTarget'
import { Schema } from 'effect'
import { ControllerWidgetType } from '../../ControllerWidget'

const state = (store: MIDIStructorStore) => {
  const one = (target: MidiTarget): MIDIStructorPad => {
    const maybe = store[MidiTarget.toKey(target)]
    if (maybe !== undefined && maybe._tag === 'pad') {
      return maybe
    } else {
      return MIDIStructorPad.make({
        target,
        color: 0,
      })
    }
  }

  const many = (targets: Readonly<Array<MidiTarget>>): Array<MIDIStructorPad> =>
    targets.map(one)

  return {
    one,
    many,
  }
}

export type MIDIStructorWidgetsType<
  A extends Array<MIDIStructorWidget<any, any>>
> = {
  [K in keyof A]: A[K]['widget']
}

type GetByName<Widgets> = Widgets extends Array<
  MIDIStructorWidget<infer K, infer A>
>
  ? (name: K) => MIDIStructorWidget<K, A>
  : never

type WidgetsUnion<A extends Array<MIDIStructorWidget<any, any>>> = {
  [K in keyof A]: ControllerWidgetType<A[K]['widget']>
}[number]

type WidgetsSchema<A extends Array<MIDIStructorWidget<any, any>>> =
  Schema.Schema<WidgetsUnion<A>, any>

export type MIDIStructorWidgets<
  Widgets extends Array<MIDIStructorWidget<any, any>>
> = {
  widgets: Widgets
  controllerWidgets: MIDIStructorWidgetsType<Widgets>
  getByName: GetByName<Widgets>
  Component: (
    widget: WidgetsUnion<Widgets>,
    onClick: OnClick,
    store: MIDIStructorStore
  ) => React.ReactElement
  schema: WidgetsSchema<Widgets>
}

export const MIDIStructorWidgets = <
  Widgets extends Array<MIDIStructorWidget<any, any>>
>(
  widgets: Widgets
): MIDIStructorWidgets<Widgets> => {
  const lookup = _.fromPairs(_.map(widgets, (w) => [w.widget.name, w]))

  const getByName: GetByName<Widgets> = ((name) =>
    lookup[name]) as GetByName<Widgets>

  const Component = (
    widget: WidgetsUnion<Widgets>,
    onClick: OnClick,
    store: MIDIStructorStore
  ): React.ReactElement => {
    // @ts-ignore
    const w = getByName(widget._tag)
    // @ts-ignore
    if (widget.target !== undefined) {
      // @ts-ignore
      return w.Component(widget, onClick, state(store).one(widget.target))
      // @ts-ignore
    } else if (widget.targets !== undefined) {
      // @ts-ignore
      return w.Component(widget, onClick, state(store).many(widget.targets))
    } else {
      return w.Component(widget)
    }
  }

  const controllerWidgets = _.map(
    widgets,
    (w) => w.widget
  ) as MIDIStructorWidgetsType<Widgets>

  const schema = Schema.Union(
    ...controllerWidgets.map((w) => w.schema as any as Schema.Schema<any>)
  ) as unknown as WidgetsSchema<Widgets>

  return {
    widgets,
    controllerWidgets,
    getByName,
    Component,
    schema,
  }
}
