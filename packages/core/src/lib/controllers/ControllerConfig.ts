import { Either, Schema } from 'effect'
import { MidiTarget } from '../midi/MidiTarget'
import _ from 'lodash'
import { ResolvedControllerWidget } from './ControllerWidget'
import { ControllerWidgets } from './ControllerWidgets'

export const ControllerConfigSchema = Schema.Struct({
  widgets: Schema.Array(ControllerWidgets.schema),
})

const collectTargets = (widgets: Array<ResolvedControllerWidget>): Array<MidiTarget> =>
  widgets.flatMap((w) => w.targets())

const duplicateTargets = (
  config: ControllerConfig,
  widgets: Array<ResolvedControllerWidget>
): Either.Either<ControllerConfig, string> => {
  const targets = collectTargets(widgets)
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
  const resolvedWidgets = ControllerWidgets.resolve(config)
  const targets = duplicateTargets(config, resolvedWidgets)
  return targets
}

const parse = (str: string): Either.Either<ControllerConfig, string> => {
  const decoded = Schema.decodeUnknownEither(Schema.parseJson(ControllerConfigSchema))(str)
  return Either.flatMap(
    Either.mapLeft(decoded, (p) => `${p}`),
    validate
  )
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
