import React from 'react'
import {
  duplicateWidget, KnobWidget,
  moveLeftWidget,
  moveRightWidget,
  removeWidget,
  replaceWidget,
  Widget, WidgetLookup,
  Widgets
} from "../../model/Widgets";
import {Box, Button, Card, CardContent, CardHeader} from "@mui/material";
import {JSONEditor} from "../JSONEditor";
import * as E from "fp-ts/Either";
import {toast} from "react-toastify";
import {PathReporter} from "io-ts/PathReporter";
import _ from 'lodash'
import IconButton from "@mui/material/IconButton";
import ArrowLeftIcon from "@mui/icons-material/ArrowLeftOutlined";
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import ArrowRightIcon from "@mui/icons-material/ArrowRightOutlined";
import DeleteIcon from "@mui/icons-material/Delete";
import {formatType} from "../../utils/TypeFormatter";

export type WidgetSettingsComponentProps = {
  widget: Widget
  setWidgets: (w: (ws: Widgets) => Widgets) => void
}

export const WidgetSettingsComponent: React.FC<WidgetSettingsComponentProps> = ({
  widget,
  setWidgets
}) => {

  console.log(formatType(KnobWidget))

  const [settings, setSettings] = React.useState(JSON.stringify(widget, null, 2))

  const onWidgetSave = () => {
    const json = E.tryCatch(
      () => JSON.parse(settings),
      e => e
    )
    const res = E.flatMap(json, Widget.decode)
    E.match<any, Widget, void>(
      (err: any) => {
        if(_.isArray(err)) {
          toast.error("Invalid widget: " + PathReporter.report(E.left(err)).join(', '))
        } else {
          toast.error("Invalid JSON: " + err)
        }
      },
      newWidget => {
        setWidgets(replaceWidget(widget, newWidget))
        toast.success("Widget saved")
      }
    )(res)
  }

  return (
    <Card>
      <CardHeader
        action={
          <Button
            onClick={() => {
              onWidgetSave()
            }}
            variant="outlined" size="small">
            Save
          </Button>
        }
        title={widget.type}
      />
      <CardContent>
        <JSONEditor
          height='300px'
          width='505px'
          readonly={false}
          onChange={setSettings}
          value={settings}
        />
        <Box>
          <IconButton
            onClick={() => {
              setWidgets(removeWidget(widget))
            }}
            aria-label="Remove Widget"
          >
            <DeleteIcon />
          </IconButton>
          <IconButton
            onClick={() => {
              setWidgets(duplicateWidget(widget))
            }}
            aria-label="Duplicate"
          >
            <ContentCopyIcon />
          </IconButton>
          <IconButton
            onClick={() => {
              setWidgets(moveLeftWidget(widget))
            }}
            aria-label="Move Left"
          >
            <ArrowLeftIcon />
          </IconButton>
          <IconButton
            onClick={() => {
              setWidgets(moveRightWidget(widget))
            }}
            aria-label="Move Right"
          >
            <ArrowRightIcon />
          </IconButton>
        </Box>
        <Box>
          HI
        </Box>
      </CardContent>
    </Card>
  )
}
