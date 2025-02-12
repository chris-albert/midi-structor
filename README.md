# MIDI Structor


```
./run.sh
```

Running agent
```
npx nx serve agent

npx nx build core

```

## Deploying

### UI
```
npx nx build ui --base './' --no-cloud
```

### Agent
```
npx nx build agent --no-cloud
```

## Running Docker locally
```
npx nx build ui --base './' --no-cloud
docker-compose up --build
```
