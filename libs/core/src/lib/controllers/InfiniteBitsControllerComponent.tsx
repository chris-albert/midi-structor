import React from 'react'
import { StopWidget } from './widgets/StopWidget'
import { PlayWidget } from './widgets/PlayWidget'
import { PlayStopWidget } from './widgets/PlayStopWidget'
import { MetronomeWidget } from './widgets/MetronomeWidget'
import { BeatsWidget } from './widgets/BeatsWidget'
import { TimeSigNoteCountWidget } from './widgets/TimeSigNoteCountWidget'
import { TimeSigNoteLengthWidget } from './widgets/TimeSigNoteLengthWidget'
import { SongsWidget } from './widgets/SongsWidget'
import { BarTrackerWidget } from './widgets/BarTrackerWidget'
import { TrackSectionsWidget } from './widgets/TrackSectionsWidget'
import { KeyBoardWidget } from './widgets/KeyBoardWidget'
import { MidiTarget } from '../midi/MidiTarget'
import { Controller } from './Controller'

type InfiniteBitsControllerComponentProps = {
  controller: Controller
  name: string
}

export const InfiniteBitsControllerComponent: React.FC<InfiniteBitsControllerComponentProps> = ({
  controller,
  name,
}) => {
  return (
    <controller
      model={controller}
      name={name}>
      <StopWidget target={MidiTarget.cc(19)} />
      <PlayWidget target={MidiTarget.cc(29)} />
      <PlayStopWidget target={MidiTarget.cc(89)} />
      <MetronomeWidget target={MidiTarget.cc(99)} />
      <BeatsWidget targets={MidiTarget.notes({ from: 81, to: 88 })} />
      <TimeSigNoteCountWidget targets={MidiTarget.notes({ from: 61, to: 68 })} />
      <TimeSigNoteLengthWidget targets={MidiTarget.notes({ from: 51, to: 58 })} />
      {/*<SongsWidget*/}
      {/*  targets={MidiTarget.notes({ from: 11, to: 18 })}*/}
      {/*  trackName='Songs'*/}
      {/*  fromClip={0}*/}
      {/*  toClip={7}*/}
      {/*/>*/}
      <BarTrackerWidget
        targets={MidiTarget.notes({ from: 71, to: 78 })}
        trackName='Bars'
      />
      <TrackSectionsWidget
        targets={MidiTarget.notes({ from: 41, to: 48 })}
        trackName='Parts'
        parentTrackName='Songs'
      />
      {/*<KeyBoardWidget*/}
      {/*  topTargets={MidiTarget.notes({ from: 31, to: 38 })}*/}
      {/*  bottomTargets={MidiTarget.notes({ from: 21, to: 28 })}*/}
      {/*  trackName='Notes'*/}
      {/*/>*/}
    </controller>
  )
}
