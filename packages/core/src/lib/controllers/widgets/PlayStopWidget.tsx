import { StopWidget } from './StopWidget'
import { PlayWidget } from './PlayWidget'
import { MidiTarget } from '../../midi/MidiTarget'
import { ProjectHooks } from '../../project/ProjectHooks'
import { Color } from '../Color'
import { ControllerWidget } from '../ControllerWidget'
import { Schema } from 'effect'

export const PlayStopWidget = ControllerWidget({
  name: 'play-stop',
  schema: Schema.TaggedStruct('play-stop', {
    target: MidiTarget.Schema,
    playColor: Color.Schema,
    stopColor: Color.Schema,
  }),
  targets: (w) => [w.target],
  component: ({ target, playColor, stopColor }) => {
    const isPlaying = ProjectHooks.useIsPlaying()

    return isPlaying
      ? StopWidget.component({ target, color: stopColor })
      : PlayWidget.component({ target, color: playColor })
  },
})
