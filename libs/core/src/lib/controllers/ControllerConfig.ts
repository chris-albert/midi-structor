import { Schema } from 'effect'
import { MidiTarget } from '../midi/MidiTarget'
import { Color } from './Color'

const optionalColor = (color: Color) => Schema.optionalWith(Color.Schema, { default: () => color })

export const StopWidget = Schema.TaggedStruct('stop', {
  target: MidiTarget.Schema,
  color: optionalColor(Color.RED),
})

export const PlayWidget = Schema.TaggedStruct('play', {
  target: MidiTarget.Schema,
  color: optionalColor(Color.GREEN),
})

export const PlayStopWidget = Schema.TaggedStruct('play-stop', {
  target: MidiTarget.Schema,
  playColor: optionalColor(Color.GREEN),
  stopColor: optionalColor(Color.RED),
})

export const MetronomeWidget = Schema.TaggedStruct('metronome', {
  target: MidiTarget.Schema,
  oneColor: optionalColor(Color.GREEN),
  restColor: optionalColor(Color.RED),
})

export const BeatsWidget = Schema.TaggedStruct('beats', {
  targets: Schema.Array(MidiTarget.Schema),
  oneColor: optionalColor(Color.GREEN),
  restColor: optionalColor(Color.RED),
})

export const TimeSigCountWidget = Schema.TaggedStruct('time-sig-count', {
  targets: Schema.Array(MidiTarget.Schema),
  color: optionalColor(Color.BLUE),
})

export const TimeSigLengthWidget = Schema.TaggedStruct('time-sig-length', {
  targets: Schema.Array(MidiTarget.Schema),
  color: optionalColor(Color.PURPLE),
})

export const NavClipsWidget = Schema.TaggedStruct('nav-clips', {
  targets: Schema.Array(MidiTarget.Schema),
  trackName: Schema.String,
  fromClip: Schema.Number,
  toClip: Schema.Number,
})

export const BarTrackerWidget = Schema.TaggedStruct('bar-tracker', {
  targets: Schema.Array(MidiTarget.Schema),
  trackName: Schema.String,
  color: optionalColor(Color.GREEN),
})

export const TrackSectionsWidget = Schema.TaggedStruct('track-sections', {
  targets: Schema.Array(MidiTarget.Schema),
  trackName: Schema.String,
  parentTrackName: Schema.String,
})

export const KeyBoardWidget = Schema.TaggedStruct('keyboard', {
  topTargets: Schema.Array(MidiTarget.Schema),
  bottomTargets: Schema.Array(MidiTarget.Schema),
  trackName: Schema.String,
})

export const ControllerWidgets = Schema.Union(
  StopWidget,
  PlayWidget,
  PlayStopWidget,
  MetronomeWidget,
  BeatsWidget,
  TimeSigCountWidget,
  TimeSigLengthWidget,
  NavClipsWidget,
  BarTrackerWidget,
  TrackSectionsWidget,
  KeyBoardWidget
)
