import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight'
import ArrowDropUpIcon from '@mui/icons-material/ArrowDropUp'
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown'
import ArrowLeftIcon from '@mui/icons-material/ArrowLeft'
import ArrowRightIcon from '@mui/icons-material/ArrowRight'
import { Box } from '@mui/material'
import { Controller, MidiTarget } from '@midi-structor/core'
import { ControllerPad, ControllerUI, midiFromRowCol } from './ControllerUI'

export const LaunchPadMiniMk3UI = (controller: Controller) =>
  new ControllerUI({
    controller,
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
