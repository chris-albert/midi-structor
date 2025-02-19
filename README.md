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

Making MacOSX icons
```
brew install makeicns
makeicns -512 midi-structor-logo-512.png
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
