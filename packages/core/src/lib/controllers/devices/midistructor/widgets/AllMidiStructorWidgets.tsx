import { PlayStopWidgetComponent } from './PlayStopWidgetComponent'
import { BeatsWidgetComponent } from './BeatsWidgetComponent'
import { ActiveClipWidgetComponent } from './ActiveClipWidgetComponent'
import { MIDIStructorWidgets } from '../MIDIStructorWidgets'

export const AllMidiStructorWidgets = MIDIStructorWidgets([
  PlayStopWidgetComponent,
  BeatsWidgetComponent,
  ActiveClipWidgetComponent,
])
