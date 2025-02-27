import React, { ReactElement } from 'react'
import {
  InputLabel,
  Select,
  MenuItem,
  FormControl,
  SelectChangeEvent,
  Box,
  TextField,
  InputAdornment,
  OutlinedInput,
} from '@mui/material'
import _ from 'lodash'
import AddCircleIcon from '@mui/icons-material/AddCircle'
import IconButton from '@mui/material/IconButton'

export type SelectItem<A = string> = {
  label: string
  value: A
}

export type SelectComponentProps<A> = {
  label: string
  items: Array<SelectItem<A>>
  onChange: (a: A | undefined) => void
  activeLabel?: string
  containEmpty?: boolean
  onNew?: (label: string) => void
}

export const SelectComponent = <A,>({
  label,
  items,
  onChange,
  activeLabel,
  containEmpty = false,
  onNew,
}: SelectComponentProps<A>): ReactElement<any, any> => {
  const [value, setValue] = React.useState<number | ''>('')
  const [newLabel, setNewLabel] = React.useState('')

  React.useEffect(() => {
    if (activeLabel !== undefined) {
      const activeItem = _.find(items, (i) => i.label === activeLabel)
      const activeIndex = _.indexOf(items, activeItem)
      if (activeIndex >= 0) {
        setValue(activeIndex)
      }
    } else {
      setValue('')
    }
  }, [activeLabel, items])

  const onChangeLocal = (event: SelectChangeEvent<number>) => {
    const changedValue = event.target.value
    if (_.isNumber(changedValue) && changedValue < _.size(items)) {
      setValue(changedValue)
      onChange(_.get(items, changedValue).value)
    } else {
      onChange(undefined)
    }
  }

  return (
    <FormControl
      sx={{ m: 1, minWidth: 140 }}
      size='small'>
      <InputLabel id='demo-simple-select-label'>{label}</InputLabel>
      <Select
        labelId='demo-simple-select-label'
        id='demo-simple-select'
        value={value}
        label={label}
        onChange={onChangeLocal}
        autoWidth>
        {containEmpty ? <MenuItem value=''>--</MenuItem> : null}
        {items.map((item, index) => (
          <MenuItem
            key={`${label}-menu-item-${index}`}
            value={index}>
            {item.label}
          </MenuItem>
        ))}
        {onNew !== undefined ? (
          <Box sx={{ p: 1 }}>
            <OutlinedInput
              size='small'
              placeholder='Add new'
              onChange={(e) => setNewLabel(e.target.value)}
              endAdornment={
                <InputAdornment position='end'>
                  <IconButton
                    onClick={() => {
                      onNew(newLabel)
                    }}>
                    <AddCircleIcon />
                  </IconButton>
                </InputAdornment>
              }
            />
          </Box>
        ) : null}
      </Select>
    </FormControl>
  )
}
