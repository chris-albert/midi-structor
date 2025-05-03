import { PlayStopWidgetComponent } from './PlayStopWidgetComponent'
import { BeatsWidgetComponent } from './BeatsWidgetComponent'
import { ActiveClipWidgetComponent } from './ActiveClipWidgetComponent'
import { MIDIStructorWidgets } from '../MIDIStructorWidgets'
import { TempoWidgetComponent } from './TempoWidgetComponent'
import { TimeSigWidgetComponent } from './TimeSigWidgetComponent'
import { BeatWidgetComponent } from './BeatWidgetComponent'
import { NavClipsWidgetComponent } from './NavClipsWidgetComponent'
import { TrackSectionsWidgetComponent } from './TrackSectionsWidgetComponent'
import { SpacerWidgetComponent } from './SpacerWidgetComponent'

export const AllMidiStructorWidgets = MIDIStructorWidgets([
  PlayStopWidgetComponent,
  BeatsWidgetComponent,
  ActiveClipWidgetComponent,
  TempoWidgetComponent,
  TimeSigWidgetComponent,
  BeatWidgetComponent,
  NavClipsWidgetComponent,
  TrackSectionsWidgetComponent,
  SpacerWidgetComponent,
])
