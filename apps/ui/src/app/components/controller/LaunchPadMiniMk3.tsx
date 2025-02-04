import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight'
import ArrowDropUpIcon from '@mui/icons-material/ArrowDropUp'
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown'
import ArrowLeftIcon from '@mui/icons-material/ArrowLeft'
import ArrowRightIcon from '@mui/icons-material/ArrowRight'
import { Box } from '@mui/material'
import _ from 'lodash'
import {
  SysExMessage,
  MidiEmitter,
  MidiListener,
  Controller,
  Color,
  MidiTarget,
  ControllerPad,
  midiFromRowCol,
} from '@midi-structor/core'

const sysex = (body: Array<number>): SysExMessage => ({
  type: 'sysex',
  manufacturer: 0,
  body,
})

export const LaunchPadMiniMk3 = (emitter: MidiEmitter, listener: MidiListener) =>
  new Controller({
    init: () => {
      emitter.send(sysex([32, 41, 2, 13, 14, 1]))
    },
    render: (pads) => {
      const sysexArr = [32, 41, 2, 13, 3]
      _.forEach(pads, (pad) => {
        if (pad.color !== undefined) {
          const [r, g, b] = Color.toRGB(pad.color)
          sysexArr.push(3, MidiTarget.toValue(pad.target), r / 2, g / 2, b / 2)
        }
      })
      emitter.send(sysex(sysexArr))
    },
    on: (f) => {
      listener.on('*', f)
    },
    pads: [
      [
        new ControllerPad({
          target: MidiTarget.note(91),
          content: <ArrowDropUpIcon />,
        }),
        new ControllerPad({
          target: MidiTarget.note(92),
          content: <ArrowDropDownIcon />,
        }),
        new ControllerPad({
          target: MidiTarget.note(93),
          content: <ArrowLeftIcon />,
        }),
        new ControllerPad({
          target: MidiTarget.note(94),
          content: <ArrowRightIcon />,
        }),
        new ControllerPad({
          target: MidiTarget.note(95),
          content: <>Session</>,
        }),
        new ControllerPad({
          target: MidiTarget.note(96),
          content: <>Drums</>,
        }),
        new ControllerPad({
          target: MidiTarget.note(97),
          content: <>Keys</>,
        }),
        new ControllerPad({
          target: MidiTarget.note(98),
          content: <>User</>,
        }),
        new ControllerPad({
          target: MidiTarget.note(99),
          content: <></>,
        }),
      ],
      [
        ...new Array(8).fill(0).map(
          (_, i) =>
            new ControllerPad({
              target: MidiTarget.note(midiFromRowCol(8, i)),
              content: <></>,
            }),
        ),
        new ControllerPad({
          target: MidiTarget.note(89),
          content: <KeyboardArrowRightIcon />,
        }),
      ],
      [
        ...new Array(8).fill(0).map(
          (_, i) =>
            new ControllerPad({
              target: MidiTarget.note(midiFromRowCol(7, i)),
              content: <></>,
            }),
        ),
        new ControllerPad({
          target: MidiTarget.note(79),
          content: <KeyboardArrowRightIcon />,
        }),
      ],
      [
        ...new Array(8).fill(0).map(
          (_, i) =>
            new ControllerPad({
              target: MidiTarget.note(midiFromRowCol(6, i)),
              content: <></>,
            }),
        ),
        new ControllerPad({
          target: MidiTarget.note(69),
          content: <KeyboardArrowRightIcon />,
        }),
      ],
      [
        ...new Array(8).fill(0).map(
          (_, i) =>
            new ControllerPad({
              target: MidiTarget.note(midiFromRowCol(5, i)),
              content: <></>,
            }),
        ),
        new ControllerPad({
          target: MidiTarget.note(59),
          content: <KeyboardArrowRightIcon />,
        }),
      ],
      [
        ...new Array(8).fill(0).map(
          (_, i) =>
            new ControllerPad({
              target: MidiTarget.note(midiFromRowCol(4, i)),
              content: <></>,
            }),
        ),
        new ControllerPad({
          target: MidiTarget.note(49),
          content: <KeyboardArrowRightIcon />,
        }),
      ],
      [
        ...new Array(8).fill(0).map(
          (_, i) =>
            new ControllerPad({
              target: MidiTarget.note(midiFromRowCol(3, i)),
              content: <></>,
            }),
        ),
        new ControllerPad({
          target: MidiTarget.note(39),
          content: <KeyboardArrowRightIcon />,
        }),
      ],
      [
        ...new Array(8).fill(0).map(
          (_, i) =>
            new ControllerPad({
              target: MidiTarget.note(midiFromRowCol(2, i)),
              content: <></>,
            }),
        ),
        new ControllerPad({
          target: MidiTarget.note(29),
          content: <KeyboardArrowRightIcon />,
        }),
      ],

      [
        ...new Array(8).fill(0).map(
          (_, i) =>
            new ControllerPad({
              target: MidiTarget.note(midiFromRowCol(1, i)),
              content: <></>,
            }),
        ),
        new ControllerPad({
          target: MidiTarget.note(19),
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
