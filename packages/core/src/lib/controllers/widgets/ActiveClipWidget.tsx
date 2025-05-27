import React from 'react'
import { Schema } from 'effect'
import { ControllerWidget } from '../ControllerWidget'
import { ProjectHooks } from '../../project/ProjectHooks'
import { Color } from '../Color'

export const ActiveClipWidget = ControllerWidget.one({
  name: 'active-clip',
  schema: Schema.Struct({
    trackName: Schema.String,
  }),
  init: () => ({
    trackName: 'Track',
  }),
  tracks: (w) => [w.trackName],
  component: ({ target, trackName }) => {
    const track = ProjectHooks.useTrack(trackName)
    const activeClip = ProjectHooks.useActiveClip(track)

    return (
      <pad
        target={target}
        color={activeClip.type === 'real' ? activeClip.color : Color.BLACK}
        options={{
          label: activeClip.type === 'real' ? activeClip.name : undefined,
        }}
      />
    )
  },
})
