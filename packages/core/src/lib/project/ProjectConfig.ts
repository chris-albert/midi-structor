import { Schema } from 'effect'
import { ConfiguredController } from '../controllers/ConfiguredController'

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

export const ProjectsConfig = Schema.Struct({
  active: Schema.String,
  projects: Schema.Array(ProjectConfigSchema),
})

export type ProjectsConfig = Schema.Schema.Type<typeof ProjectsConfig>

export const ProjectConfig = {
  Schema: ProjectConfigSchema,
}
