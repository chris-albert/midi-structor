import { App } from './app/App'

try {
  App.run()
} catch (error) {
  console.error('App error', error)
}
