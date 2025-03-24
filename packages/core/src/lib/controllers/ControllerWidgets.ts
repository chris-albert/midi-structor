import { NavClipsWidget } from './widgets/NavClipsWidget'
import { PlayWidget } from './widgets/PlayWidget'
import _ from 'lodash'
import { ControllerWidget, ResolvedControllerWidget } from './ControllerWidget'
import { ControllerConfig } from './ControllerConfig'
import { Option, Schema } from 'effect'
import { StopWidget } from './widgets/StopWidget'
import { RecordWidget } from './widgets/RecordWidget'
import { MetronomeControlWidget } from './widgets/MetronomeControlWidget'
import { LoopControlWidget } from './widgets/LoopControlWidget'
import { PlayStopWidget } from './widgets/PlayStopWidget'
import { MetronomeWidget } from './widgets/MetronomeWidget'
import { BeatsWidget } from './widgets/BeatsWidget'
import { TimeSigNoteCountWidget } from './widgets/TimeSigNoteCountWidget'
import { TimeSigNoteLengthWidget } from './widgets/TimeSigNoteLengthWidget'
import { BarTrackerWidget } from './widgets/BarTrackerWidget'
import { TrackSectionsWidget } from './widgets/TrackSectionsWidget'
import { KeyBoardWidget } from './widgets/KeyBoardWidget'
import { ButtonWidget } from './widgets/ButtonWidget'

const AllControllerWidgets: Array<ControllerWidget<any>> = [
  PlayWidget,
  StopWidget,
  RecordWidget,
  MetronomeControlWidget,
  LoopControlWidget,
  PlayStopWidget,
  MetronomeWidget,
  BeatsWidget,
  TimeSigNoteCountWidget,
  TimeSigNoteLengthWidget,
  NavClipsWidget,
  BarTrackerWidget,
  TrackSectionsWidget,
  KeyBoardWidget,
  ButtonWidget,
]

type WidgetsSchemas<A extends Array<{ schema: Schema.Schema<any> }>> = {
  [Key in keyof A]: A[Key]['schema'] extends Schema.Schema<infer T> ? T : never
}

type AllControllerWidgetsSchemas = WidgetsSchemas<typeof AllControllerWidgets>

export const ControllerWidgets = (() => {
  const lookup = _.fromPairs(_.map(AllControllerWidgets, (widget) => [widget.name, widget]))
  const schema: Schema.Schema<AllControllerWidgetsSchemas> = Schema.Union(
    ...AllControllerWidgets.map((w) => w.schema)
  )

  const resolve = (config: ControllerConfig): Array<ResolvedControllerWidget> => {
    return config.widgets.flatMap((w: any) => {
      return Option.match(getByName(w._tag), {
        onSome: (controllerWidget) => {
          return {
            name: controllerWidget.name,
            targets: () => controllerWidget.targets(w),
            component: () => controllerWidget.component(w),
          } as ResolvedControllerWidget
        },
        onNone: () => {
          console.error('No widget found for config', w)
          return []
        },
      })
    })
  }

  const getByName = (name: string): Option.Option<ControllerWidget<any>> =>
    Option.fromNullable(_.get(lookup, name, undefined))

  return {
    schema,
    resolve,
    getByName,
  }
})()
