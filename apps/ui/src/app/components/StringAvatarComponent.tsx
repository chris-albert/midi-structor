import React from 'react'
import { Avatar } from '@mui/material'

function stringToColor(string: string) {
  let hash = 0
  let i

  /* eslint-disable no-bitwise */
  for (i = 0; i < string.length; i += 1) {
    hash = string.charCodeAt(i) + ((hash << 5) - hash)
  }

  let color = '#'

  for (i = 0; i < 3; i += 1) {
    const value = (hash >> (i * 8)) & 0xff
    color += `00${value.toString(16)}`.slice(-2)
  }
  /* eslint-enable no-bitwise */

  return color
}

function stringAvatar(name: string, size: number) {
  const split = name.split(' ')

  return {
    sx: {
      width: size,
      height: size,
      bgcolor: stringToColor(name),
    },
    children: split.length > 1 ? `${name.split(' ')[0][0]}${name.split(' ')[1][0]}` : name.substring(0, 2),
  }
}

export type StringAvatarComponentProps = {
  label: string
  size?: number
}

export const StringAvatarComponent: React.FC<StringAvatarComponentProps> = ({ label, size = 25 }) => {
  return <Avatar {...stringAvatar(label, size)} />
}
