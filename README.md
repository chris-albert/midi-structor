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
//First we have to build the UI with correct paths
npx nx build ui --no-cloud --base './'

//Then we can run the electron code
./electron.sh
```

Building electron:
```


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
