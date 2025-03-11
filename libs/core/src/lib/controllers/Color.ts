const fromRGB = (red: number, green: number, blue: number): Color =>
  0x1000000 + ((red << 16) | (green << 8) | (blue << 0))

const toHex = (color: Color): string => color.toString(16).slice(1)

const toRGB = (color: Color): [number, number, number] => [
  (color >> 16) & 255,
  (color >> 8) & 255,
  color & 255,
]

export type Color = number

export const Color = {
  fromRGB,
  toHex,
  toRGB,
  BLACK: fromRGB(0, 0, 0),
  RED: fromRGB(255, 0, 0),
  GREEN: fromRGB(0, 255, 0),
  BLUE: fromRGB(0, 0, 255),
  PURPLE: fromRGB(128, 0, 128),
}
