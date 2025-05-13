
# Installing a node package to a submodule
```
pnpm --filter @midi-structor/core i promise-worker
```

https://docs.cycling74.com/legacy/max8/vignettes/live_object_model

## This project uses `turborepo` and `pnpm`

Prereqs:
```
nvm use
pnpm install
```

Running web app locally:
```
./run.sh
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

Initialize Messages
```mermaid
sequenceDiagram
    MIDI Structor->>Ableton: ready
    Ableton->>MIDI Structor: init-project
    loop Each Clip
        Ableton->>MIDI Structor: init-clip
    end
    loop Each Track
        Ableton->>MIDI Structor: init-track
    end
    loop Each Cue
        Ableton->>MIDI Structor: init-cue
    end
    Ableton->>MIDI Structor: init-done
```

Real Time Messages
```mermaid
sequenceDiagram
    Ableton->>MIDI Structor: beat [number]
    Ableton->>MIDI Structor: sig [number, number]
    Ableton->>MIDI Structor: bar-beat [number]
    Ableton->>MIDI Structor: tempo [number]
    Ableton->>MIDI Structor: is-playing [boolean]
    Ableton->>MIDI Structor: metronome-state [boolean]
    Ableton->>MIDI Structor: loop-state [boolean]
```

Control Messages
```mermaid
sequenceDiagram
    MIDI Structor->>Ableton: play
    MIDI Structor->>Ableton: stop
    MIDI Structor->>Ableton: jumpToCue [number]
    MIDI Structor->>Ableton: record
    MIDI Structor->>Ableton: metronome [boolean]
    MIDI Structor->>Ableton: loop [boolean]
    
```
