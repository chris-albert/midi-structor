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
import { ButtonWidgetComponent } from './ButtonWidgetComponent'
import { KnobWidgetComponent } from './KnobWidgetComponent'
import { MetronomeControlWidgetComponent } from './MetronomeControlWidgetComponent'

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
  ButtonWidgetComponent,
  KnobWidgetComponent,
  MetronomeControlWidgetComponent,
])
