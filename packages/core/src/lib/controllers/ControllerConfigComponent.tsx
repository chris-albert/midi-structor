import React from 'react'
import { Controller } from './Controller'
import { ControllerConfig, ControllerWidget } from './ControllerConfig'
import { StopWidget } from './widgets/StopWidget'
import { PlayWidget } from './widgets/PlayWidget'
import { Color } from './Color'
import { PlayStopWidget } from './widgets/PlayStopWidget'
import { MetronomeWidget } from './widgets/MetronomeWidget'
import { BeatsWidget } from './widgets/BeatsWidget'
import { TimeSigNoteCountWidget } from './widgets/TimeSigNoteCountWidget'
import { TimeSigNoteLengthWidget } from './widgets/TimeSigNoteLengthWidget'
import { SongsWidget } from './widgets/SongsWidget'
import { BarTrackerWidget } from './widgets/BarTrackerWidget'
import { TrackSectionsWidget } from './widgets/TrackSectionsWidget'
import { KeyBoardWidget } from './widgets/KeyBoardWidget'
import { RecordWidget } from './widgets/RecordWidget'
import { MetronomeControlWidget } from './widgets/MetronomeControlWidget'
import { LoopControlWidget } from './widgets/LoopControlWidget'

const getWidgetComponent = (widget: ControllerWidget, index: number): React.ReactElement | undefined => {
  if (widget._tag === 'stop') {
    return (
      <StopWidget
        key={`stop-${index}`}
        target={widget.target}
        color={Color.fromHex(widget.color)}
      />
    )
  } else if (widget._tag === 'play') {
    return (
      <PlayWidget
        key={`play-${index}`}
        target={widget.target}
        color={Color.fromHex(widget.color)}
      />
    )
  } else if (widget._tag === 'record') {
    return (
      <RecordWidget
        key={`play-${index}`}
        target={widget.target}
        color={Color.fromHex(widget.color)}
      />
    )
  } else if (widget._tag === 'play-stop') {
    return (
      <PlayStopWidget
        key={`play-stop-${index}`}
        target={widget.target}
        playColor={Color.fromHex(widget.playColor)}
        stopColor={Color.fromHex(widget.stopColor)}
      />
    )
  } else if (widget._tag === 'loop-control') {
    return (
      <LoopControlWidget
        key={`play-stop-${index}`}
        target={widget.target}
        color={Color.fromHex(widget.color)}
      />
    )
  } else if (widget._tag === 'metronome-control') {
    return (
      <MetronomeControlWidget
        key={`metronome-control-${index}`}
        target={widget.target}
        color={Color.fromHex(widget.color)}
      />
    )
  } else if (widget._tag === 'metronome') {
    return (
      <MetronomeWidget
        key={`metronome-${index}`}
        target={widget.target}
        oneColor={Color.fromHex(widget.oneColor)}
        restColor={Color.fromHex(widget.restColor)}
      />
    )
  } else if (widget._tag === 'beats') {
    return (
      <BeatsWidget
        key={`beats-${index}`}
        targets={[...widget.targets]}
        oneColor={Color.fromHex(widget.oneColor)}
        restColor={Color.fromHex(widget.restColor)}
      />
    )
  } else if (widget._tag === 'time-sig-count') {
    return (
      <TimeSigNoteCountWidget
        key={`time-sig-count-${index}`}
        targets={[...widget.targets]}
        color={Color.fromHex(widget.color)}
      />
    )
  } else if (widget._tag === 'time-sig-length') {
    return (
      <TimeSigNoteLengthWidget
        key={`time-sig-length-${index}`}
        targets={[...widget.targets]}
        color={Color.fromHex(widget.color)}
      />
    )
  } else if (widget._tag === 'nav-clips') {
    return (
      <SongsWidget
        key={`nav-clips-${index}`}
        targets={[...widget.targets]}
        trackName={widget.trackName}
        fromClip={widget.fromClip}
        toClip={widget.toClip}
      />
    )
  } else if (widget._tag === 'bar-tracker') {
    return (
      <BarTrackerWidget
        key={`bar-tracker-${index}`}
        targets={[...widget.targets]}
        trackName={widget.trackName}
        color={Color.fromHex(widget.color)}
      />
    )
  } else if (widget._tag === 'track-sections') {
    return (
      <TrackSectionsWidget
        key={`track-sections-${index}`}
        targets={[...widget.targets]}
        trackName={widget.trackName}
        parentTrackName={widget.parentTrackName}
      />
    )
  } else if (widget._tag === 'keyboard') {
    return (
      <KeyBoardWidget
        key={`keyboard-${index}`}
        topTargets={[...widget.topTargets]}
        bottomTargets={[...widget.bottomTargets]}
        trackName={widget.trackName}
      />
    )
  } else {
    return undefined
  }
}

export type ControllerConfigComponentProps = {
  controller: Controller
  name: string
  config: ControllerConfig
}

export const ControllerConfigComponent: React.FC<ControllerConfigComponentProps> = ({
  controller,
  name,
  config,
}) => {
  return (
    <controller
      model={controller}
      name={name}>
      {config.widgets.map(getWidgetComponent)}
    </controller>
  )
}
