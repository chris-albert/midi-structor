import React from 'react'
import { MIDIStructorWidget } from '../MIDIStructorWidget'
import { PlayStopWidgetComponent } from './PlayStopWidgetComponent'
import { BeatsWidgetComponent } from './BeatsWidgetComponent'
import { ActiveClipWidgetComponent } from './ActiveClipWidgetComponent'
import {
  MIDIStructorPad,
  MIDIStructorStore,
  MIDIStructorUIWidget,
  MidiTarget,
} from '@midi-structor/core'
import { OnClick } from '../MidiStructorComponent'
import { Option } from 'effect'
import _ from 'lodash'

const all: Array<MIDIStructorWidget<any, any>> = [
  PlayStopWidgetComponent,
  BeatsWidgetComponent,
  ActiveClipWidgetComponent,
]

const widgetLookup = _.fromPairs(_.map(all, (w) => [w.widget.name, w]))

const findMIDIStructorWidget = (
  tag: string
): Option.Option<MIDIStructorWidget<any, any>> => {
  return Option.fromNullable(_.get(widgetLookup, tag, undefined))
}

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

const Component = (
  widget: MIDIStructorUIWidget,
  onClick: OnClick,
  store: MIDIStructorStore
): React.ReactElement => {
  return Option.match(findMIDIStructorWidget(widget._tag), {
    onSome: (w) => {
      // @ts-ignore
      if (widget.target !== undefined) {
        // @ts-ignore
        return w.Component(widget, onClick, state(store).one(widget.target))
        // @ts-ignore
      } else if (widget.targets !== undefined) {
        // @ts-ignore
        return w.Component(widget, onClick, state(store).many(widget.targets))
      } else {
        return <>Issue rendering component</>
      }
    },
    onNone: () => <>Unknown widget {widget._tag}</>,
  })
}

export const AllMidiStructorWidgets = {
  Component,
  all,
}
