import React from 'react'

import { PadProps as BasePadProps } from '../../renderer/MidiReconciler'
import { Color } from '../Color'
import { ForeverBeat } from '../../hooks/ForeverBeat'

export type PadProps = BasePadProps & {
  isFlashing?: boolean
}

export const Pad: React.FC<PadProps> = (props) => {
  const [color, setColor] = React.useState(props.color)

  React.useEffect(() => {
    if (props.isFlashing) {
      return ForeverBeat.onTick((p) => setColor(p.halfBeat ? Color.BLACK : props.color))
    } else {
      setColor(props.color)
      return () => {}
    }
  }, [props.color, props.isFlashing])

  return (
    <pad
      {...props}
      color={color}
    />
  )
}
