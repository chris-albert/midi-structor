import { Schema } from 'effect'

export const ProjectConfigSchema = Schema.Struct({
  label: Schema.String,
  key: Schema.String,
  abletonProject: Schema.optional(Schema.String),
  style: Schema.Struct({
    accent: Schema.Struct({
      color1: Schema.String,
      color2: Schema.String,
    }),
  }),
})

export type ProjectConfig = Schema.Schema.Type<typeof ProjectConfigSchema>

export const ProjectsConfig = Schema.Struct({
  projects: Schema.Array(ProjectConfigSchema),
})

export type ProjectsConfig = Schema.Schema.Type<typeof ProjectsConfig>

const defaultProjectConfig = (): ProjectConfig => ({
  label: 'Default',
  key: 'default',
  style: {
    accent: {
      color1: '#6a11cb',
      color2: '#2575fc',
    },
  },
})

const defaultProjectsConfig: () => ProjectsConfig = () => ({
  projects: [defaultProjectConfig()],
})

export const ProjectConfig = {
  Schema: ProjectConfigSchema,
  defaultProjectConfig,
  defaultProjectsConfig,
}
