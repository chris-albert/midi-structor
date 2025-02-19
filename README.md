# MIDI Structor


```
./run.sh
```

Running agent
```
npx nx serve agent --no-cloud

npx nx build core --no-cloud

npx nx serve electron --no-cloud
```

Running electron
```
./electron.sh
```

Building electron:
```
npx nx make electron --no-cloud
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
