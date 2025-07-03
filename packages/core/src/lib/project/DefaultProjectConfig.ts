import { ProjectConfig, ProjectsConfig } from './ProjectConfig'

export const DefaultProjectConfig = (): ProjectConfig => ({
  label: 'Default',
  key: 'default',
  controllers: [],
  style: {
    accent: {
      color1: '#6a11cb',
      color2: '#2575fc',
    },
  },
})

export const ReloadProjectConfig = (): ProjectConfig => ({
  label: 'Reload',
  key: 'reload-project',
  controllers: [],
  style: {
    accent: {
      color1: '#6a11cb',
      color2: '#2575fc',
    },
  },
})

export const DefaultProjectsConfig = (): ProjectsConfig => ({
  active: 'default',
  projects: [DefaultProjectConfig(), ReloadProjectConfig()],
})
