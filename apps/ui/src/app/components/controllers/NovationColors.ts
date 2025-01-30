import _ from 'lodash'

//Decompiled ableton sources https://github.com/gluon/AbletonLive11_MIDIRemoteScripts
// Toook mappings from  https://github.com/zapperment/launchpad-colour-mod/tree/main
const CLIP_COLOR_TABLE = {
  // salmon
  16304336: 107,

  // frank orange
  15579756: 61,

  // dirty gold
  12890726: 100,

  // lemonade
  15856827: 73,

  // lime
  12380990: 85,

  // highlighter green
  5632102: 87,

  // bianchi
  6418872: 88,

  // turquoise
  9959144: 32,

  // sky blue
  12442873: 91,

  // sapphire
  9811172: 92,

  // periwinkle
  12766969: 116,

  // orchid
  14793450: 52,

  // magenta
  14853318: 82,

  // white
  16777215: 3,

  // fire hydrant red
  15694713: 106,

  // tangerine
  14780736: 127,

  // sand
  10855297: 105,

  // sunshine yellow
  15723127: 14,

  // terminal green
  11728803: 86,

  // forest
  5357093: 19,

  // tiffany blue
  2014124: 65,

  // cyan
  5628654: 68,

  // cerulean
  4764640: 39,

  // united nations blue
  1935034: 43,

  // amtethyst
  12565226: 93,

  // iris
  14076642: 116,

  // flamingo
  15695577: 53,

  // aluminum
  16054262: 2,

  // terracotta
  14790567: 105,

  // light salmon
  16173488: 107,

  // whiskey
  14604478: 8,

  // canary
  15924181: 73,

  // primrose
  15200983: 113,

  // wild willow
  13952703: 16,

  // dark sea green
  13756371: 24,

  // honeydew
  15465713: 114,

  // pale turquoise
  15530491: 114,

  // periwinkle
  15331061: 118,

  // fog
  15855863: 2,

  // dull lavender
  14605298: 116,

  // whisper
  16579836: 119,

  // silver chalice
  14214111: 118,

  // dusty pink
  14735828: 2,

  // barley corn
  12695710: 105,

  // pale oyster
  11911343: 118,

  // dark khaki
  13687734: 110,

  // pistachio
  10664482: 18,

  // dollar bill
  10669463: 16,

  // neptune
  12837852: 89,

  // nepal
  13952230: 89,

  // polo blue
  12638174: 36,

  // vista blue
  12701922: 116,

  // amethyst smoke
  14080993: 2,

  // lilac
  15263724: 118,

  // turkish rose
  13878477: 70,

  // steel
  10073772: 117,

  // medium carmine
  11628393: 121,

  // red ochre
  11304802: 83,

  // coffee
  8289123: 83,

  // durian yellow
  13418542: 15,

  // pomelo green
  9152321: 19,

  // apple
  7451749: 27,

  // aquamarine
  1811861: 65,

  // sea blue
  3177621: 43,

  // cosmic cobalt
  2837410: 51,

  // sapphire
  5077422: 112,

  // plump purple
  9541570: 93,

  // purpureus
  11967942: 70,

  // fuchsia rose
  13007771: 55,

  // eclipse
  4151376: 103,
}

const RGB_COLOR_TABLE: Array<[number, number]> = [
  [0, 0],
  [1, 1973790],
  [2, 8355711],
  [3, 16777215],
  [4, 16731212],
  [5, 16711680],
  [6, 5832704],
  [7, 1638400],
  [8, 16760172],
  [9, 16733184],
  [10, 5840128],
  [11, 2562816],
  [12, 16777036],
  [13, 16776960],
  [14, 5855488],
  [15, 1644800],
  [16, 8978252],
  [17, 5570304],
  [18, 1923328],
  [19, 1321728],
  [20, 5046092],
  [21, 65280],
  [22, 22784],
  [23, 6400],
  [24, 5046110],
  [25, 65305],
  [26, 22797],
  [27, 6402],
  [28, 5046152],
  [29, 65365],
  [30, 22813],
  [31, 7954],
  [32, 5046199],
  [33, 65433],
  [34, 22837],
  [35, 6418],
  [36, 5030911],
  [37, 43519],
  [38, 16722],
  [39, 4121],
  [40, 5015807],
  [41, 22015],
  [42, 7513],
  [43, 2073],
  [44, 5000447],
  [45, 255],
  [46, 89],
  [47, 25],
  [48, 8867071],
  [49, 5505279],
  [50, 1638500],
  [51, 983088],
  [52, 16731391],
  [53, 16711935],
  [54, 5832793],
  [55, 1638425],
  [56, 16731271],
  [57, 16711764],
  [58, 5832733],
  [59, 2228243],
  [60, 16717056],
  [61, 10040576],
  [62, 7950592],
  [63, 4416512],
  [64, 211200],
  [65, 22325],
  [66, 21631],
  [67, 255],
  [68, 17743],
  [69, 2425036],
  [70, 8355711],
  [71, 2105376],
  [72, 16711680],
  [73, 12451629],
  [74, 11529478],
  [75, 6618889],
  [76, 1084160],
  [77, 65415],
  [78, 43519],
  [79, 11007],
  [80, 4129023],
  [81, 7995647],
  [82, 11672189],
  [83, 4202752],
  [84, 16730624],
  [85, 8970502],
  [86, 7536405],
  [87, 65280],
  [88, 3931942],
  [89, 5898097],
  [90, 3735500],
  [91, 5999359],
  [92, 3232198],
  [93, 8880105],
  [94, 13835775],
  [95, 16711773],
  [96, 16744192],
  [97, 12169216],
  [98, 9502464],
  [99, 8609031],
  [100, 3746560],
  [101, 1330192],
  [102, 872504],
  [103, 1381674],
  [104, 1450074],
  [105, 6896668],
  [106, 11010058],
  [107, 14569789],
  [108, 14182940],
  [109, 16769318],
  [110, 10412335],
  [111, 6796559],
  [112, 1973808],
  [113, 14483307],
  [114, 8454077],
  [115, 10131967],
  [116, 9332479],
  [117, 4210752],
  [118, 7697781],
  [119, 14745599],
  [120, 10485760],
  [121, 3473408],
  [122, 1757184],
  [123, 475648],
  [124, 12169216],
  [125, 4141312],
  [126, 11755264],
  [127, 4920578],
]

const findNearestColor = (sourceColor: number): number => {
  const hexToChannels = (colorInHex: number): [number, number, number] => [
    (colorInHex & 16711680) >> 16,
    (colorInHex & 65280) >> 8,
    colorInHex & 255,
  ]

  const squaredDistance = (color: [number, number]): number => {
    const z = _.zip(hexToChannels(sourceColor), hexToChannels(color[1]))
    const powed = _.compact(
      _.map(z, ([a, b]) => (a !== undefined && b !== undefined ? Math.pow(a - b, 2) : undefined)),
    )
    return _.sum(powed)
  }

  let minIndex = 127
  let minValue = Number.MAX_VALUE
  _.forEach(RGB_COLOR_TABLE, ([index, color]) => {
    const sq = squaredDistance([index, color])
    if (sq < minValue) {
      minValue = sq
      minIndex = index
    }
  })
  return minIndex
}

export const getNovationColor = (color: number): number =>
  _.get(CLIP_COLOR_TABLE, color, findNearestColor(color))
