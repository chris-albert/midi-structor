import React from 'react'
import {
  MIDIStructorPad,
  MIDIStructorStore,
  MIDIStructorUIWidget,
  MidiTarget,
} from '@midi-structor/core'
import { PlayStopWidgetComponent } from './widgets/PlayStopWidgetComponent'
import { Box } from '@mui/material'
import { OnClick } from './MidiStructorComponent'
import { BeatsWidgetComponent } from './widgets/BeatsWidgetComponent'
import { ActiveClipWidgetComponent } from './widgets/ActiveClipWidgetComponent'

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

const getWidgetComponent = (
  widget: MIDIStructorUIWidget,
  onClick: OnClick,
  store: MIDIStructorStore
): React.ReactElement => {
  if (widget._tag === 'play-stop') {
    return PlayStopWidgetComponent.Component(
      widget,
      onClick,
      state(store).one(widget.target)
    )
  } else if (widget._tag === 'beats') {
    return BeatsWidgetComponent.Component(
      widget,
      onClick,
      state(store).many(widget.targets)
    )
  } else if (widget._tag === 'active-clip') {
    return ActiveClipWidgetComponent.Component(
      widget,
      onClick,
      state(store).one(widget.target)
    )
  } else {
    return <>Unknown Widget</>
  }
}

const getLabel = (widget: MIDIStructorUIWidget): React.ReactElement | null =>
  widget.label === undefined ? null : (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}>
      <Box
        sx={{
          position: 'absolute',
          x: 0,
          y: '0',
          marginTop: '-16px',
          backgroundColor: '#777777',
          border: '1px solid white',
          lineHeight: 1,
          borderBottomLeftRadius: '5px',
          borderBottomRightRadius: '5px',
          paddingLeft: '3px',
          paddingRight: '3px',
        }}>
        {widget.label}
      </Box>
    </Box>
  )

export type WidgetComponentProps = {
  widget: MIDIStructorUIWidget
  onClick: OnClick
  store: MIDIStructorStore
}

export const WidgetComponent: React.FC<WidgetComponentProps> = ({
  widget,
  onClick,
  store,
}) => {
  const el = getWidgetComponent(widget, onClick, store)
  const label = getLabel(widget)
  const widgetBody = (
    <Box
      sx={{
        p: 2,
        borderSize: `${widget.border?.sizePx || 1}px`,
        borderColor: widget.border?.color || 'white',
        borderStyle: 'solid',
        borderRadius: '5px',
      }}>
      {label}
      <Box>{el}</Box>
    </Box>
  )
  return <Box>{widgetBody}</Box>
}
