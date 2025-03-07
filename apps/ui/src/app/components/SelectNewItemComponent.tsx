import React from 'react'
import { Box, InputAdornment, OutlinedInput } from '@mui/material'
import IconButton from '@mui/material/IconButton'
import AddCircleIcon from '@mui/icons-material/AddCircle'

export type SelectNewItemComponentProps = {
  onNew: (newLabel: string) => void
}

export const SelectNewItemComponent: React.FC<SelectNewItemComponentProps> = ({ onNew }) => {
  const [newLabel, setNewLabel] = React.useState('')

  return (
    <Box sx={{ p: 1 }}>
      <OutlinedInput
        size='small'
        value={newLabel}
        placeholder='Add new'
        onChange={(e) => setNewLabel(e.target.value)}
        endAdornment={
          <InputAdornment position='end'>
            <IconButton
              onClick={() => {
                onNew(newLabel)
                setNewLabel('')
              }}>
              <AddCircleIcon />
            </IconButton>
          </InputAdornment>
        }
      />
    </Box>
  )
}
