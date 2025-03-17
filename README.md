# MIDI Structor

Prereqs:
```
yarn install
nvm use
npx nx reset
```

Running web app locally:
```
./run.sh
```

Dumb nx error, clean up 
```
npx nx reset
```

Running electron
```
./electron-run.sh
```

Building electron, including bundling the ui:
```
./electron-make.sh
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
