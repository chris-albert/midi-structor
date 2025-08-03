import express from 'express'

const run = (
  port: number,
  onProject: (raw: string) => void,
  log: (s: string) => void
) => {
  const app = express()

  app.use(express.json())

  app.get('/ping', (req, res) => {
    log('Agent Server /ping')
    res.send('pong')
  })

  app.post('/project', (req, res) => {
    log(`Agent Server /project ${req.body}`)
    onProject(req.body)
    res.send('ok')
  })

  app.listen(port, () => {
    log(`Server listening on http://localhost:${port}`)
  })
}

export const Server = {
  run,
}
