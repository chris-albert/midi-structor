import { Schema, Option, Either } from 'effect'
import { ConfiguredController } from '../controllers/ConfiguredController'
import _ from 'lodash'
import { SchemaHelper } from '../util/SchemaHelper'

export const ProjectConfigSchema = Schema.Struct({
  label: Schema.String,
  key: Schema.String,
  abletonProject: Schema.optional(Schema.String),
  controllers: ConfiguredController.SchemaArray,
  style: Schema.Struct({
    accent: Schema.Struct({
      color1: Schema.String,
      color2: Schema.String,
    }),
  }),
})

export type ProjectConfig = Schema.Schema.Type<typeof ProjectConfigSchema>

const ProjectsConfigSchema = Schema.Struct({
  active: Schema.String,
  projects: Schema.Array(ProjectConfigSchema),
})

export type ProjectsConfig = Schema.Schema.Type<typeof ProjectsConfigSchema>

const stringify = (config: ProjectConfig): string =>
  SchemaHelper.encode(ProjectConfigSchema, config)

const parse = (str: string): Either.Either<ProjectConfig, string> =>
  SchemaHelper.decodeString<
    ProjectConfig,
    Either.Either<ProjectConfig, string>,
    any
  >({
    schema: ProjectConfigSchema,
    str,
    ok: Either.right,
    error: Either.left,
  })

export const ProjectConfig = {
  Schema: ProjectConfigSchema,
  stringify,
  parse,
}

const getActive = (config: ProjectsConfig): Option.Option<ProjectConfig> =>
  Option.fromNullable(_.find(config.projects, (p) => p.key === config.active))

export const ProjectsConfig = {
  Schema: ProjectsConfigSchema,
  getActive,
}
