import { ControllerConfig } from '../ControllerConfig'

const TestingConfig: ControllerConfig = {
  widgets: [
    {
      _tag: 'play-stop',
      target: {
        _tag: 'CC',
        controllerNumber: 19,
      },
      playColor: '00FF00',
      stopColor: 'FF0000',
    },
  ],
}

const InfiniteBitsDefaultConfig: ControllerConfig = {
  widgets: [
    {
      _tag: 'stop',
      target: {
        _tag: 'CC',
        controllerNumber: 19,
      },
      color: 'FF0000',
    },
    {
      _tag: 'play',
      target: {
        _tag: 'CC',
        controllerNumber: 29,
      },
      color: '00FF00',
    },
    {
      _tag: 'metronome',
      target: {
        _tag: 'CC',
        controllerNumber: 99,
      },
      oneColor: '00FF00',
      restColor: 'FF0000',
    },
    {
      _tag: 'beats',
      targets: [
        {
          _tag: 'Note',
          note: 81,
        },
        {
          _tag: 'Note',
          note: 82,
        },
        {
          _tag: 'Note',
          note: 83,
        },
        {
          _tag: 'Note',
          note: 84,
        },
        {
          _tag: 'Note',
          note: 85,
        },
        {
          _tag: 'Note',
          note: 86,
        },
        {
          _tag: 'Note',
          note: 87,
        },
        {
          _tag: 'Note',
          note: 88,
        },
      ],
      oneColor: '00FF00',
      restColor: 'FF0000',
    },
    {
      _tag: 'bar-tracker',
      targets: [
        {
          _tag: 'Note',
          note: 71,
        },
        {
          _tag: 'Note',
          note: 72,
        },
        {
          _tag: 'Note',
          note: 73,
        },
        {
          _tag: 'Note',
          note: 74,
        },
        {
          _tag: 'Note',
          note: 75,
        },
        {
          _tag: 'Note',
          note: 76,
        },
        {
          _tag: 'Note',
          note: 77,
        },
        {
          _tag: 'Note',
          note: 78,
        },
      ],
      trackName: 'Bars',
      color: '00FF00',
    },
    {
      _tag: 'time-sig-count',
      targets: [
        {
          _tag: 'Note',
          note: 61,
        },
        {
          _tag: 'Note',
          note: 62,
        },
        {
          _tag: 'Note',
          note: 63,
        },
        {
          _tag: 'Note',
          note: 64,
        },
        {
          _tag: 'Note',
          note: 65,
        },
        {
          _tag: 'Note',
          note: 66,
        },
        {
          _tag: 'Note',
          note: 67,
        },
        {
          _tag: 'Note',
          note: 68,
        },
      ],
      color: '0000FF',
    },
    {
      _tag: 'time-sig-length',
      targets: [
        {
          _tag: 'Note',
          note: 51,
        },
        {
          _tag: 'Note',
          note: 52,
        },
        {
          _tag: 'Note',
          note: 53,
        },
        {
          _tag: 'Note',
          note: 54,
        },
        {
          _tag: 'Note',
          note: 55,
        },
        {
          _tag: 'Note',
          note: 56,
        },
        {
          _tag: 'Note',
          note: 57,
        },
        {
          _tag: 'Note',
          note: 58,
        },
      ],
      color: '800080',
    },
    {
      _tag: 'track-sections',
      targets: [
        {
          _tag: 'Note',
          note: 41,
        },
        {
          _tag: 'Note',
          note: 42,
        },
        {
          _tag: 'Note',
          note: 43,
        },
        {
          _tag: 'Note',
          note: 44,
        },
        {
          _tag: 'Note',
          note: 45,
        },
        {
          _tag: 'Note',
          note: 46,
        },
        {
          _tag: 'Note',
          note: 47,
        },
        {
          _tag: 'Note',
          note: 48,
        },
      ],
      trackName: 'Parts',
      parentTrackName: 'Songs',
    },
    {
      _tag: 'nav-clips',
      targets: [
        {
          _tag: 'Note',
          note: 31,
        },
        {
          _tag: 'Note',
          note: 32,
        },
        {
          _tag: 'Note',
          note: 33,
        },
        {
          _tag: 'Note',
          note: 34,
        },
        {
          _tag: 'Note',
          note: 35,
        },
        {
          _tag: 'Note',
          note: 36,
        },
        {
          _tag: 'Note',
          note: 37,
        },
        {
          _tag: 'Note',
          note: 38,
        },
      ],
      trackName: 'Songs',
      fromClip: 16,
      toClip: 23,
    },
    {
      _tag: 'nav-clips',
      targets: [
        {
          _tag: 'Note',
          note: 21,
        },
        {
          _tag: 'Note',
          note: 22,
        },
        {
          _tag: 'Note',
          note: 23,
        },
        {
          _tag: 'Note',
          note: 24,
        },
        {
          _tag: 'Note',
          note: 25,
        },
        {
          _tag: 'Note',
          note: 26,
        },
        {
          _tag: 'Note',
          note: 27,
        },
        {
          _tag: 'Note',
          note: 28,
        },
      ],
      trackName: 'Songs',
      fromClip: 8,
      toClip: 15,
    },
    {
      _tag: 'nav-clips',
      targets: [
        {
          _tag: 'Note',
          note: 11,
        },
        {
          _tag: 'Note',
          note: 12,
        },
        {
          _tag: 'Note',
          note: 13,
        },
        {
          _tag: 'Note',
          note: 14,
        },
        {
          _tag: 'Note',
          note: 15,
        },
        {
          _tag: 'Note',
          note: 16,
        },
        {
          _tag: 'Note',
          note: 17,
        },
        {
          _tag: 'Note',
          note: 18,
        },
      ],
      trackName: 'Songs',
      fromClip: 0,
      toClip: 7,
    },
  ],
}
