
# Installing a node package to a submodule
```
pnpm --filter @midi-structor/core i promise-worker
```

```
pnpm --filter @midi-structor/core -D i typescript@5.8.3
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

Building web app locally:
```
pnpm ui-deploy
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
    MIDI Structor->>Ableton: init
    Ableton->>MIDI Structor: init-ack [projectName: string]
     MIDI Structor->>Ableton: init-ready [Array<string>]
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

Electron Utility Processes
```mermaid
stateDiagram
        eMain: Main
        eLive: Live
        eProject: Project
        eDevice1: Device 1
        eDevice2: Device 2
        state Devices {
                [*] --> eDevice1
                [*] --> eDevice2
                eDevice1 --> [*]
                eDevice2 --> [*]
        }
        [*] --> eMain
        eLive --> eProject
        eMain --> eProject
        eMain --> eLive
        eMain --> Devices
        Devices --> eProject
        Devices --> eLive

```
