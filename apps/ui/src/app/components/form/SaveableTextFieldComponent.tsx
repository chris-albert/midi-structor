import React from 'react'
import {
  Button,
  FormControl,
  FormHelperText,
  InputAdornment,
  InputLabel,
  OutlinedInput,
} from '@mui/material'
import IconButton from '@mui/material/IconButton'
import SaveIcon from '@mui/icons-material/Save'
import { Option } from 'effect'
import { transformValuesSTM } from 'effect/TMap'

type InputState =
  | {
      type: 'init'
    }
  | {
      type: 'changed'
    }
  | {
      type: 'success'
    }
  | {
      type: 'error'
      error: string
    }

const stateToColor = (
  state: InputState
): 'primary' | 'success' | 'warning' | 'error' => {
  if (state.type === 'error') {
    return 'error'
  } else if (state.type === 'success') {
    return 'success'
  } else {
    return 'primary'
  }
}

export type SaveableTextFieldComponentProps = {
  label: string
  onSave: (value: string) => Option.Option<string>
  initialValue?: string
}

export const SaveableTextFieldComponent: React.FC<
  SaveableTextFieldComponentProps
> = ({ label, onSave, initialValue }) => {
  const [value, setValue] = React.useState<string>('')
  const [state, setState] = React.useState<InputState>({ type: 'init' })

  React.useEffect(() => {
    setValue(initialValue || '')
  }, [initialValue])

  React.useEffect(() => {
    if (value === initialValue) {
      setState({ type: 'init' })
    } else {
      setState({ type: 'changed' })
    }
  }, [value, initialValue])

  const onSaveClick = () => {
    Option.match(onSave(value), {
      onSome: (error) => {
        setState({ type: 'error', error })
      },
      onNone: () => {
        onSave(value)
        setState({ type: 'success' })
      },
    })
  }

  return (
    <FormControl
      variant='outlined'
      error={state.type === 'error'}>
      <InputLabel size='small'>{label}</InputLabel>
      <OutlinedInput
        label={label}
        fullWidth
        size='small'
        value={value}
        onChange={(e) => setValue(e.target.value)}
        endAdornment={
          <InputAdornment position='end'>
            <IconButton
              disabled={state.type === 'init'}
              color={stateToColor(state)}
              onClick={onSaveClick}
              edge='end'>
              <SaveIcon />
            </IconButton>
          </InputAdornment>
        }
      />
      {state.type === 'error' ? (
        <FormHelperText>{state.error}</FormHelperText>
      ) : null}
    </FormControl>
  )
}
