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

  const runAllCallbacks = (p: ForeverBeatParams) =>
    callbacks.forEach((cb) => cb(p))

  const onBeat = (beat: number) => {
    runAllCallbacks({ beat, halfBeat: false, isPlaying })
    setTimeout(() => {
      runAllCallbacks({ beat, halfBeat: true, isPlaying })
    }, millisPerHalfBeat * 0.5)
  }

  const onIsPlaying = (_isPlaying: boolean) => {
    isPlaying = _isPlaying
    if (!_isPlaying) {
      const loop = () =>
        setTimeout(() => {
          onBeat(1)
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
      millisPerHalfBeat = (60 / bpm / 2) * 1000
    } else {
      //assume 8th notes
      millisPerHalfBeat = (60 / bpm / 4) * 1000
    }
  }
  calcMillisPerHalfBeat()

  ProjectState.realTime.tempo.sub((value) => {
    bpm = value
    calcMillisPerHalfBeat()
  })

  ProjectState.realTime.timeSignature.sub((value) => {
    noteLength = value.noteLength
    calcMillisPerHalfBeat()
  })

  ProjectState.realTime.isPlaying.sub(onIsPlaying)

  ProjectState.realTime.barBeats.sub(onBeat)

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
