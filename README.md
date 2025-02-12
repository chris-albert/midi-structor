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
npx nx build ui --base 'https://chris-albert.github.io/midi-structor/' --no-cloud
```

### Agent
```
npx nx build agent --no-cloud
```

