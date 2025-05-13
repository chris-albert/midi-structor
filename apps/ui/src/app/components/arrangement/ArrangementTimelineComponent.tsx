import React from 'react'
import { useAtom } from 'jotai'
import { zoomAtom } from '../../model/Settings'
import {
  Box,
  Card,
  CardContent,
  CardHeader,
  Drawer,
  Grid,
  Typography,
} from '@mui/material'
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline'
import RemoveCircleOutlineIcon from '@mui/icons-material/RemoveCircleOutline'
import { JSONEditor } from '../JSONEditor'
import { ProjectHooks } from '@midi-structor/core'

export type ArrangementTimelineComponentProps = {}

export const ArrangementTimelineComponent: React.FC<
  ArrangementTimelineComponentProps
> = ({}) => {
  const arrangement = ProjectHooks.useArrangement()
  const [zoom, setZoom] = useAtom(zoomAtom)
  const [rawOpen, setRawOpen] = React.useState(false)

  const onRawClicked = () => {
    setRawOpen(true)
  }

  return (
    <Box>
      <Drawer
        anchor='left'
        open={rawOpen}
        onClose={() => setRawOpen(false)}>
        <Card>
          <CardHeader title='Arrangement' />
          <CardContent>
            <JSONEditor
              height='800px'
              value={JSON.stringify(arrangement, null, 2)}
            />
          </CardContent>
        </Card>
      </Drawer>
      <Box sx={{ height: 40, width: '100%' }}>
        <Grid
          container
          spacing={1}>
          <Grid
            item
            xs={10}
            container>
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                ml: 1,
                cursor: 'pointer',
                '&:hover': {
                  color: 'yellow',
                },
              }}
              onClick={onRawClicked}>
              <Typography>View Raw</Typography>
            </Box>
          </Grid>
          <Grid
            item
            xs={2}
            container
            sx={{ mt: '4px' }}>
            <Box
              sx={{ cursor: 'pointer' }}
              onClick={() => setZoom((z) => z + 1)}>
              <AddCircleOutlineIcon />
            </Box>
            <Box
              sx={{ cursor: 'pointer' }}
              onClick={() => setZoom((z) => z - 1)}>
              <RemoveCircleOutlineIcon />
            </Box>
            <Box sx={{ ml: 1 }}>{zoom}</Box>
          </Grid>
        </Grid>
      </Box>
    </Box>
  )
}
