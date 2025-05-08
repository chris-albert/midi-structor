import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight'
import ArrowDropUpIcon from '@mui/icons-material/ArrowDropUp'
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown'
import ArrowLeftIcon from '@mui/icons-material/ArrowLeft'
import ArrowRightIcon from '@mui/icons-material/ArrowRight'
import { Box } from '@mui/material'
import {
  Color,
  LaunchPadMiniMk3,
  MidiMessage,
  MidiTarget,
  SysExMessage,
  ControllerUIDevice,
  UIMessageStore,
  UIStore,
  ConfiguredController,
} from '@midi-structor/core'
import { ControllerPad, ControllerUI, midiFromRowCol } from '../ControllerUI'
import React from 'react'
import { ControllerGridComponent } from '../ControllerGridComponent'
import { atomFamily } from 'jotai/utils'
import { atom, useSetAtom } from 'jotai'
import _ from 'lodash'
import { useAtomValue } from 'jotai/index'

const controllerUI = new ControllerUI({
  pads: [
    [
      new ControllerPad({
        target: MidiTarget.cc(91),
        content: <ArrowDropUpIcon />,
      }),
      new ControllerPad({
        target: MidiTarget.cc(92),
        content: <ArrowDropDownIcon />,
      }),
      new ControllerPad({
        target: MidiTarget.cc(93),
        content: <ArrowLeftIcon />,
      }),
      new ControllerPad({
        target: MidiTarget.cc(94),
        content: <ArrowRightIcon />,
      }),
      new ControllerPad({
        target: MidiTarget.cc(95),
        content: <>Session</>,
      }),
      new ControllerPad({
        target: MidiTarget.cc(96),
        content: <>Drums</>,
      }),
      new ControllerPad({
        target: MidiTarget.cc(97),
        content: <>Keys</>,
      }),
      new ControllerPad({
        target: MidiTarget.cc(98),
        content: <>User</>,
      }),
      new ControllerPad({
        target: MidiTarget.cc(99),
        content: <></>,
      }),
    ],
    [
      ...new Array(8).fill(0).map(
        (_, i) =>
          new ControllerPad({
            target: MidiTarget.note(midiFromRowCol(8, i)),
            content: <></>,
          })
      ),
      new ControllerPad({
        target: MidiTarget.cc(89),
        content: <KeyboardArrowRightIcon />,
      }),
    ],
    [
      ...new Array(8).fill(0).map(
        (_, i) =>
          new ControllerPad({
            target: MidiTarget.note(midiFromRowCol(7, i)),
            content: <></>,
          })
      ),
      new ControllerPad({
        target: MidiTarget.cc(79),
        content: <KeyboardArrowRightIcon />,
      }),
    ],
    [
      ...new Array(8).fill(0).map(
        (_, i) =>
          new ControllerPad({
            target: MidiTarget.note(midiFromRowCol(6, i)),
            content: <></>,
          })
      ),
      new ControllerPad({
        target: MidiTarget.cc(69),
        content: <KeyboardArrowRightIcon />,
      }),
    ],
    [
      ...new Array(8).fill(0).map(
        (_, i) =>
          new ControllerPad({
            target: MidiTarget.note(midiFromRowCol(5, i)),
            content: <></>,
          })
      ),
      new ControllerPad({
        target: MidiTarget.cc(59),
        content: <KeyboardArrowRightIcon />,
      }),
    ],
    [
      ...new Array(8).fill(0).map(
        (_, i) =>
          new ControllerPad({
            target: MidiTarget.note(midiFromRowCol(4, i)),
            content: <></>,
          })
      ),
      new ControllerPad({
        target: MidiTarget.cc(49),
        content: <KeyboardArrowRightIcon />,
      }),
    ],
    [
      ...new Array(8).fill(0).map(
        (_, i) =>
          new ControllerPad({
            target: MidiTarget.note(midiFromRowCol(3, i)),
            content: <></>,
          })
      ),
      new ControllerPad({
        target: MidiTarget.cc(39),
        content: <KeyboardArrowRightIcon />,
      }),
    ],
    [
      ...new Array(8).fill(0).map(
        (_, i) =>
          new ControllerPad({
            target: MidiTarget.note(midiFromRowCol(2, i)),
            content: <></>,
          })
      ),
      new ControllerPad({
        target: MidiTarget.cc(29),
        content: <KeyboardArrowRightIcon />,
      }),
    ],

    [
      ...new Array(8).fill(0).map(
        (_, i) =>
          new ControllerPad({
            target: MidiTarget.note(midiFromRowCol(1, i)),
            content: <></>,
          })
      ),
      new ControllerPad({
        target: MidiTarget.cc(19),
        content: (
          <Box>
            <Box>Stop</Box>
            <Box>Solo</Box>
            <Box>Mute</Box>
          </Box>
        ),
      }),
    ],
  ],
})

type LaunchPadMiniColorMessage = {
  type: 'color'
  color: Color
}

export type LaunchPadMiniMessage = LaunchPadMiniColorMessage

const atomStore = atomFamily((name: string) =>
  atom<UIMessageStore<LaunchPadMiniMessage>>({})
)

const getTargetFromNum = (num: number): MidiTarget => {
  const str = num.toString()
  if (str.startsWith('9') || str.endsWith('9')) {
    return MidiTarget.cc(num)
  } else {
    return MidiTarget.note(num)
  }
}

const messagesFromSysex = (
  sysex: SysExMessage
): Array<[string, LaunchPadMiniMessage]> => {
  const colors: Array<[string, LaunchPadMiniMessage]> = []
  const colorsArray = sysex.body.slice(5)
  while (colorsArray.length >= 4) {
    colorsArray.shift()
    const target = colorsArray.shift()
    const red = colorsArray.shift()
    const green = colorsArray.shift()
    const blue = colorsArray.shift()
    // @ts-ignore
    const color = Color.fromRGB(red * 2, green * 2, blue * 2)
    colors.push([
      // @ts-ignore
      MidiTarget.toKey(getTargetFromNum(target)),
      { type: 'color', color },
    ])
  }
  return colors
}

const useStore: UIStore<LaunchPadMiniMessage> = (name) => {
  const setStore = useSetAtom(atomStore(name))
  return {
    usePut: () => (m: MidiMessage) => {
      if (m.type === 'sysex') {
        if (_.isEqual(m.body.slice(0, 5), [32, 41, 2, 13, 3])) {
          const messages = messagesFromSysex(m)
          const newStore: UIMessageStore<LaunchPadMiniMessage> = {}
          messages.forEach((message) => {
            newStore[message[0]] = message[1]
          })
          setStore((s) => ({ ...s, ...newStore }))
        }
      }
    },
    useGet: () => useAtomValue(atomStore(name)),
  }
}

export const LaunchPadMiniMk3UI = ControllerUIDevice.of({
  controller: LaunchPadMiniMk3.device,
  Component: (configuredController, device) => {
    const controller = ConfiguredController.useController(configuredController)
    return (
      <ControllerGridComponent
        controllerUI={controllerUI}
        controller={controller.controller}
        device={device}
      />
    )
  },
  useStore,
})
