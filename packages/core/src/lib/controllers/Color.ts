import { Schema } from 'effect'

const fromRGB = (red: number, green: number, blue: number): Color =>
  0x1000000 + ((red << 16) | (green << 8) | (blue << 0))

const toHex = (color: Color): string => {
  const hex = color.toString(16)
  if (hex.length > 6) {
    return hex.substring(1, 7)
  } else {
    return hex
  }
}

const toRGB = (color: Color): [number, number, number] => {
  const hex = toHex(color)
  return [
    parseInt(hex.substring(0, 2), 16),
    parseInt(hex.substring(2, 4), 16),
    parseInt(hex.substring(4, 6), 16),
  ]
}
const fromHex = (hex: string): Color => {
  const red = hex.substring(0, 2)
  const green = hex.substring(2, 4)
  const blue = hex.substring(4, 6)
  return fromRGB(parseInt(red, 16), parseInt(green, 16), parseInt(blue, 16))
}

const ColorSchema = Schema.transform(Schema.String, Schema.Number, {
  strict: true,
  decode: fromHex,
  encode: toHex,
})

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
  WHITE: fromRGB(255, 255, 255),
  ROYGBIV: [
    fromRGB(255, 0, 0), // Red
    fromRGB(255, 165, 0), // Orange
    fromRGB(255, 255, 0), // Yellow
    fromRGB(0, 255, 0), // Green
    fromRGB(0, 0, 255), // Blue
    fromRGB(75, 0, 130), // Indigo
    fromRGB(238, 130, 238), // Violet
  ],
  Schema: ColorSchema,
}
