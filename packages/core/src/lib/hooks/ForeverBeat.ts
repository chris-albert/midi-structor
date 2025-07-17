import { ProjectState } from '../state/ProjectState'

type ForeverBeatParams = {
  beat: number
  halfBeat: boolean
  isPlaying: boolean
}

type ForeverBeatCallback = (p: ForeverBeatParams) => void

type OnTick = (cb: ForeverBeatCallback) => () => void

type ForeverBeat = {
  onTick: OnTick
}

const init = (): ForeverBeat => {
  let callbacks: Array<ForeverBeatCallback> = []
  let isPlaying = false
  let bpm = 120
  let millisPerHalfBeat = 100
  let noteLength = 4
  let noteCount = 4
  let beat = 0

  const runAllCallbacks = (p: ForeverBeatParams) =>
    callbacks.forEach((cb) => cb(p))

  const onBeat = (_beat: number) => {
    beat = _beat
  }

  const notPlayingFlash = () => {
    runAllCallbacks({ beat: 1, halfBeat: false, isPlaying })
    setTimeout(() => {
      runAllCallbacks({ beat: 1, halfBeat: true, isPlaying })
    }, Math.floor(millisPerHalfBeat * 0.5))
  }

  const onTickChanged = (tick: number) => {
    const correctedBeat = beat === noteCount ? 1 : beat + 1
    if (noteLength === 4) {
      if (tick === 0) {
        runAllCallbacks({ beat: correctedBeat, halfBeat: false, isPlaying })
      } else if (tick === 2) {
        runAllCallbacks({ beat: correctedBeat, halfBeat: true, isPlaying })
      }
    } else {
      if (tick === 0 || tick === 5) {
        runAllCallbacks({ beat: correctedBeat, halfBeat: false, isPlaying })
      } else if (tick === 2 || tick === 7) {
        runAllCallbacks({ beat: correctedBeat, halfBeat: true, isPlaying })
      }
    }
  }

  const onIsPlaying = (_isPlaying: boolean) => {
    isPlaying = _isPlaying
    if (!_isPlaying) {
      const loop = () =>
        setTimeout(() => {
          notPlayingFlash()
          if (!isPlaying) {
            loop()
          }
        }, millisPerHalfBeat * 2)
      loop()
    }
  }
  onIsPlaying(false)

  const calcMillisPerHalfBeat = () => {
    if (noteLength <= 4) {
      millisPerHalfBeat = Math.floor((60 / bpm / 2) * 1000)
    } else {
      //assume 8th notes
      millisPerHalfBeat = Math.floor((60 / bpm / 4) * 1000)
    }
  }
  calcMillisPerHalfBeat()

  ProjectState.realTime.tempo.sub((value) => {
    bpm = value
    calcMillisPerHalfBeat()
  })

  ProjectState.realTime.timeSignature.sub((value) => {
    noteLength = value.noteLength
    noteCount = value.noteCount
    calcMillisPerHalfBeat()
  })

  ProjectState.realTime.isPlaying.sub(onIsPlaying)

  ProjectState.realTime.barBeats.sub(onBeat)
  ProjectState.realTime.tick.sub(onTickChanged)

  const onTick = (f: ForeverBeatCallback) => {
    callbacks = [...callbacks, f]
    return () => {
      callbacks = callbacks.filter((cb) => cb !== f)
    }
  }

  return {
    onTick,
  }
}

let ForeverBeatInstance: ForeverBeat | undefined = undefined

const SingletonForeverCallback = () => {
  if (ForeverBeatInstance === undefined) {
    ForeverBeatInstance = init()
  }
  return ForeverBeatInstance
}

const onTick: OnTick = (cb) => {
  return SingletonForeverCallback().onTick(cb)
}

export const ForeverBeat = {
  onTick,
}
