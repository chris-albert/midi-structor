
# Installing a node package to a submodule
```
pnpm --filter @midi-structor/core i jotai-minidb
pnpm --save-dev i eslint-plugin-import
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

## State Diagrams

Clean Init
```mermaid
sequenceDiagram
  autonumber
  participant O as Owner
  participant L as Borrower 1
  participant B as Borrower 2


  O ->> O: init
  L ->> L: init
  L ->> O: init {id}
  O ->> L: init-ack {id, value}

  B ->> B: init
  B ->> O: init {id}
  O ->> B: init-ack {id, value}
```

After init updates
```mermaid
sequenceDiagram
  autonumber
  participant O as Owner
  participant L as Borrower 1
  participant B as Borrower 2

  opt Updated by Owner
    O ->> O: update (internal)

    opt State Updated
      O ->> L: update {value}
    end

    opt State Updated
      O ->> B: update {value}
    end
  end

  opt Updated by Borrower 1
    L ->> O: update {value}

    opt State Updated
      O ->> L: update {value}
    end

    opt State Updated
      O ->> B: update {value}
    end

  end

  opt Updated by Borrower 2
    B ->> O: update {value}

    opt State Updated
      O ->> L: update {value}
    end

    opt State Updated
      O ->> B: update {value}
    end

  end
```

