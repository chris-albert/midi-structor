import { Schema } from 'effect'

const fromRGB = (red: number, green: number, blue: number): Color =>
  0x1000000 + ((red << 16) | (green << 8) | (blue << 0))

const toHex = (color: Color): string => color.toString(16).slice(1)

const toRGB = (color: Color): [number, number, number] => [
  (color >> 16) & 255,
  (color >> 8) & 255,
  color & 255,
]

const fromHex = (hex: string): Color => {
  const red = hex.substring(0, 2)
  const green = hex.substring(2, 4)
  const blue = hex.substring(4, 6)
  return fromRGB(parseInt(red, 16), parseInt(green, 16), parseInt(blue, 16))
}

const ColorSchema = Schema.String

export type Color = number

export const Color = {
  fromRGB,
  fromHex,
  toHex,
  toRGB,
  BLACK: fromRGB(0, 0, 0),
  RED: fromRGB(255, 0, 0),
  GREEN: fromRGB(0, 255, 0),
  BLUE: fromRGB(0, 0, 255),
  PURPLE: fromRGB(128, 0, 128),
  YELLOW: fromRGB(255, 255, 0),
  Schema: ColorSchema,
}
