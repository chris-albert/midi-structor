import React, { ReactElement } from 'react'
import { InputLabel, Select, MenuItem, FormControl, SelectChangeEvent } from '@mui/material'
import _ from 'lodash'

export type SelectItem<A = string> = {
  label: string
  value: A
}

export type SelectComponentProps<A> = {
  label: string
  items: Array<SelectItem<A>>
  onChange: (a: A | undefined) => void
  activeLabel?: string
}

export const SelectComponent = <A,>({
  label,
  items,
  onChange,
  activeLabel,
}: SelectComponentProps<A>): ReactElement<any, any> => {
  const [value, setValue] = React.useState<number | ''>('')

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
        <MenuItem value=''>--</MenuItem>
        {items.map((item, index) => (
          <MenuItem
            key={`${label}-menu-item-${index}`}
            value={index}>
            {item.label}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  )
}
