import { App } from './app/App'
import { Server } from './app/Server'

try {
  // App.run()
  Server.run(3333)
} catch (error) {
  console.error('App error', error)
}
