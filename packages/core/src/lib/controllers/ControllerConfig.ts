import { Either, Schema, Option } from 'effect'
import { MidiTarget } from '../midi/MidiTarget'
import _ from 'lodash'
import { ResolvedControllerWidget } from './ControllerWidget'
import { ControllerDevice } from './devices/ControllerDevice'

export const ControllerConfigSchema = Schema.Struct({
  widgets: Schema.Array(Schema.Any),
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

const validate = (
  config: ControllerConfig,
  device: ControllerDevice
): Either.Either<ControllerConfig, string> => {
  const resolvedWidgets = device.widgets.resolve(config)
  const targets = duplicateTargets(config, resolvedWidgets)
  return targets
}

const schema = (device: ControllerDevice): Schema.Schema<ControllerConfig> =>
  Schema.Struct({
    widgets: Schema.Array(device.widgets.schema),
  })

const parse = (str: string, device: ControllerDevice): Either.Either<ControllerConfig, string> => {
  const decoded = Schema.decodeUnknownEither(Schema.parseJson(schema(device)))(str)
  return Either.flatMap(
    Either.mapLeft(decoded, (p) => {
      console.error('error decoding', p)
      return `${p}`
    }),
    (c) => validate(c, device)
  )
}

const stringify = (config: ControllerConfig, device: ControllerDevice): string => {
  return Option.match(Schema.encodeOption(schema(device))(config), {
    onSome: (c) => JSON.stringify(c, null, 2),
    onNone: () => 'Error decoding controller config',
  })
}

const empty = (): ControllerConfig => ({
  widgets: [],
})

export type ControllerConfig = typeof ControllerConfigSchema.Type

export const ControllerConfig = {
  empty,
  parse,
  stringify,
}
