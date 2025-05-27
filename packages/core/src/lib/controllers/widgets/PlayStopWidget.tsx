import { StopWidget } from './StopWidget'
import { PlayWidget } from './PlayWidget'
import { ProjectHooks } from '../../project/ProjectHooks'
import { Color } from '../Color'
import { ControllerWidget } from '../ControllerWidget'
import { Schema } from 'effect'

export const PlayStopWidget = ControllerWidget.one({
  name: 'play-stop',
  schema: Schema.Struct({
    playColor: Color.Schema,
    stopColor: Color.Schema,
  }),
  init: () => ({
    playColor: Color.GREEN,
    stopColor: Color.RED,
  }),
  component: ({ target, playColor, stopColor }) => {
    const isPlaying = ProjectHooks.useIsPlaying()

    return isPlaying
      ? StopWidget.component({ target, color: stopColor })
      : PlayWidget.component({ target, color: playColor })
  },
})
