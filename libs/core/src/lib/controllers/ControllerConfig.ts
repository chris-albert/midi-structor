import { Schema } from 'effect'
import { MidiTarget } from '../midi/MidiTarget'
import { Color } from './Color'

export const StopWidget = Schema.TaggedStruct('stop', {
  target: MidiTarget.Schema,
  color: Schema.optional(Color.Schema),
})

export const PlayWidget = Schema.TaggedStruct('play', {
  target: MidiTarget.Schema,
  color: Schema.optional(Color.Schema),
})

export const PlayStopWidget = Schema.TaggedStruct('play-stop', {
  target: MidiTarget.Schema,
  playColor: Schema.optional(Color.Schema),
  stopColor: Schema.optional(Color.Schema),
})

export const MetronomeWidget = Schema.TaggedStruct('metronome', {
  target: MidiTarget.Schema,
  oneColor: Schema.optional(Color.Schema),
  restColor: Schema.optional(Color.Schema),
})

export const BeatsWidget = Schema.TaggedStruct('beats', {
  targets: Schema.Array(MidiTarget.Schema),
  oneColor: Schema.optional(Color.Schema),
  restColor: Schema.optional(Color.Schema),
})

export const TimeSigCountWidget = Schema.TaggedStruct('time-sig-count', {
  targets: Schema.Array(MidiTarget.Schema),
  color: Schema.optional(Color.Schema),
})

export const TimeSigLengthWidget = Schema.TaggedStruct('time-sig-length', {
  targets: Schema.Array(MidiTarget.Schema),
  color: Schema.optional(Color.Schema),
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
  color: Schema.optional(Color.Schema),
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

export const ControllerConfigSchema = Schema.Struct({
  widgets: Schema.Array(ControllerWidgets),
})

const empty = (): ControllerConfig => ({
  widgets: [],
})

export type ControllerConfig = typeof ControllerConfigSchema.Type

export const ControllerConfig = {
  Schema: ControllerConfigSchema,
  empty,
}
