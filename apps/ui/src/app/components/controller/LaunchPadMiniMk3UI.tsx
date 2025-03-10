import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight'
import ArrowDropUpIcon from '@mui/icons-material/ArrowDropUp'
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown'
import ArrowLeftIcon from '@mui/icons-material/ArrowLeft'
import ArrowRightIcon from '@mui/icons-material/ArrowRight'
import { Box } from '@mui/material'
import { MidiTarget } from '@midi-structor/core'
import { ControllerPad, ControllerUI, midiFromRowCol } from './ControllerUI'

export const LaunchPadMiniMk3UI = () =>
  new ControllerUI({
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
