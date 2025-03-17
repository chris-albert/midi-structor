import React, { ReactElement } from 'react'
import { InputLabel, Select, MenuItem, FormControl, SelectChangeEvent, Box, Button } from '@mui/material'
import _ from 'lodash'
import { SelectNewItemComponent } from './SelectNewItemComponent'
import IconButton from '@mui/material/IconButton'
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline'

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
  noItemsLabel?: string
  onNew?: (label: string) => void
  onDelete?: (item: A) => void
}

export const SelectComponent = <A,>({
  label,
  items,
  onChange,
  activeLabel,
  containEmpty = false,
  noItemsLabel,
  onNew,
  onDelete,
}: SelectComponentProps<A>): ReactElement<any, any> => {
  const [value, setValue] = React.useState<number | ''>('')
  const [isEdit, setIsEdit] = React.useState(false)

  const handleClick = () => {
    setIsEdit((e) => !e)
  }

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
        onClose={() => setIsEdit(false)}
        onChange={onChangeLocal}
        autoWidth>
        {containEmpty ? <MenuItem value=''>--</MenuItem> : null}
        {noItemsLabel !== undefined && items.length === 0 ? (
          <MenuItem value=''>{noItemsLabel}</MenuItem>
        ) : null}
        {items.map((item, index) =>
          isEdit ? (
            <Box
              key={`${label}-menu-edit-${index}`}
              sx={{
                pl: 2,
                pr: 1,
                display: 'flex',
                justifyContent: 'space-between',
              }}>
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                }}>
                {item.label}
              </Box>
              <Box>
                {onDelete !== undefined ? (
                  <IconButton
                    size='small'
                    onClick={() => {
                      onDelete(item.value)
                    }}>
                    <DeleteOutlineIcon color='error' />
                  </IconButton>
                ) : null}
              </Box>
            </Box>
          ) : (
            <MenuItem
              key={`${label}-menu-item-${index}`}
              value={index}>
              <Box>{item.label}</Box>
            </MenuItem>
          )
        )}
        {onNew !== undefined ? (
          <Box>
            {isEdit ? <SelectNewItemComponent onNew={onNew} /> : null}
            <Box
              sx={{
                p: 0,
                pt: 1,
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
              }}>
              <Button
                size='small'
                onClick={handleClick}>
                Edit
              </Button>
            </Box>
          </Box>
        ) : null}
      </Select>
    </FormControl>
  )
}
