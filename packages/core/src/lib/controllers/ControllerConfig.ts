import { Either, Schema } from 'effect'
import { MidiTarget } from '../midi/MidiTarget'
import { Color } from './Color'
import _ from 'lodash'
import { JsonUtil } from '../util/JsonUtil'

export const StopWidget = Schema.TaggedStruct('stop', {
  target: MidiTarget.Schema,
  color: Color.Schema,
})

export const PlayWidget = Schema.TaggedStruct('play', {
  target: MidiTarget.Schema,
  color: Color.Schema,
})

export const RecordWidget = Schema.TaggedStruct('record', {
  target: MidiTarget.Schema,
  color: Color.Schema,
})

export const MetronomeControlWidget = Schema.TaggedStruct('metronome-control', {
  target: MidiTarget.Schema,
  color: Color.Schema,
})

export const LoopControlWidget = Schema.TaggedStruct('loop-control', {
  target: MidiTarget.Schema,
  color: Color.Schema,
})

export const PlayStopWidget = Schema.TaggedStruct('play-stop', {
  target: MidiTarget.Schema,
  playColor: Color.Schema,
  stopColor: Color.Schema,
})

export const MetronomeWidget = Schema.TaggedStruct('metronome', {
  target: MidiTarget.Schema,
  oneColor: Color.Schema,
  restColor: Color.Schema,
})

export const BeatsWidget = Schema.TaggedStruct('beats', {
  targets: Schema.Array(MidiTarget.Schema),
  oneColor: Color.Schema,
  restColor: Color.Schema,
})

export const TimeSigCountWidget = Schema.TaggedStruct('time-sig-count', {
  targets: Schema.Array(MidiTarget.Schema),
  color: Color.Schema,
})

export const TimeSigLengthWidget = Schema.TaggedStruct('time-sig-length', {
  targets: Schema.Array(MidiTarget.Schema),
  color: Color.Schema,
})

export const NavClipsWidget = Schema.TaggedStruct('nav-clips', {
  targets: Schema.Array(MidiTarget.Schema),
  trackName: Schema.String,
  fromClip: Schema.Number,
  toClip: Schema.Number,
  sort: Schema.optional(Schema.Literal('alphabetical', 'order')),
})

export const BarTrackerWidget = Schema.TaggedStruct('bar-tracker', {
  targets: Schema.Array(MidiTarget.Schema),
  trackName: Schema.String,
  color: Color.Schema,
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

export const ControllerWidget = Schema.Union(
  StopWidget,
  PlayWidget,
  RecordWidget,
  PlayStopWidget,
  MetronomeControlWidget,
  LoopControlWidget,
  MetronomeWidget,
  BeatsWidget,
  TimeSigCountWidget,
  TimeSigLengthWidget,
  NavClipsWidget,
  BarTrackerWidget,
  TrackSectionsWidget,
  KeyBoardWidget
)

export type ControllerWidget = typeof ControllerWidget.Type

export const ControllerConfigSchema = Schema.Struct({
  widgets: Schema.Array(ControllerWidget),
})

const getTargets = (widget: ControllerWidget): Array<MidiTarget> => {
  if (widget._tag === 'stop') {
    return [widget.target]
  } else if (widget._tag === 'play') {
    return [widget.target]
  } else if (widget._tag === 'record') {
    return [widget.target]
  } else if (widget._tag === 'play-stop') {
    return [widget.target]
  } else if (widget._tag === 'metronome-control') {
    return [widget.target]
  } else if (widget._tag === 'metronome') {
    return [widget.target]
  } else if (widget._tag === 'loop-control') {
    return [widget.target]
  } else if (widget._tag === 'beats') {
    return [...widget.targets]
  } else if (widget._tag === 'time-sig-count') {
    return [...widget.targets]
  } else if (widget._tag === 'time-sig-length') {
    return [...widget.targets]
  } else if (widget._tag === 'nav-clips') {
    return [...widget.targets]
  } else if (widget._tag === 'bar-tracker') {
    return [...widget.targets]
  } else if (widget._tag === 'track-sections') {
    return [...widget.targets]
  } else if (widget._tag === 'keyboard') {
    return [...widget.topTargets, ...widget.bottomTargets]
  } else {
    return []
  }
}

const collectTargets = (config: ControllerConfig): Array<MidiTarget> => config.widgets.flatMap(getTargets)

const duplicateTargets = (config: ControllerConfig): Either.Either<ControllerConfig, string> => {
  const targets = collectTargets(config)
  const lookup: Record<string, number> = {}
  targets.forEach((target) => {
    const key = MidiTarget.toKey(target)
    const l = lookup[key]
    if (l === undefined) {
      lookup[key] = 1
    } else {
      lookup[key] = l + 1
    }
  })
  const duplicates: Array<string> = []
  _.forEach(lookup, (count, key) => {
    if (count > 1) {
      duplicates.push(key)
    }
  })
  if (_.isEmpty(duplicates)) {
    return Either.right(config)
  } else {
    return Either.left(`Midi targets duplicated ${duplicates}`)
  }
}

const validate = (config: ControllerConfig): Either.Either<ControllerConfig, string> => {
  const targets = duplicateTargets(config)
  return targets
}

const parse = (str: string): Either.Either<ControllerConfig, string> => {
  const a = Either.mapLeft(JsonUtil.parseSchema(str, ControllerConfigSchema), (p) => `${p}`)
  const b = Either.flatMap(a, validate)
  return b
}

const empty = (): ControllerConfig => ({
  widgets: [],
})

export type ControllerConfig = typeof ControllerConfigSchema.Type

export const ControllerConfig = {
  Schema: ControllerConfigSchema,
  empty,
  parse,
}
