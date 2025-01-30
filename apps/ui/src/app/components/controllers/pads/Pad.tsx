import React from 'react'

import { PadProps as BasePadProps } from '../../../renderer/MidiReconciler'
import { Color } from '../Color'

export type PadProps = BasePadProps & {
  isFlashing?: boolean
}

export const Pad: React.FC<PadProps> = (props) => {
  const [color, setColor] = React.useState(props.color)

  React.useEffect(() => {
    if (props.isFlashing) {
      const timer = setInterval(() => {
        setColor((c) => (c === Color.BLACK ? props.color : Color.BLACK))
      }, 250)
      return () => clearInterval(timer)
    } else {
      setColor(props.color)
    }
  }, [props.color, props.isFlashing])

  return (
    <pad
      {...props}
      color={color}
    />
  )
}
