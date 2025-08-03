import express from 'express'

const run = (port: number) => {
  const app = express()

  app.use(express.json())

  app.get('/ping', (req, res) => {
    console.log('Agent Server /ping')
    res.send('pong')
  })

  app.post('/project', (req, res) => {
    console.log('Agent Server /project', req.body)
    res.send('ok')
  })

  app.listen(port, () => {
    console.log(`Server listening on http://localhost:${port}`)
  })
}

export const Server = {
  run,
}
