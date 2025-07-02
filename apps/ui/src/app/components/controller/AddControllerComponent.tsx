import React from 'react'
import { Box, Button, Divider, TextField, Typography } from '@mui/material'
import { Controller, useForm } from 'react-hook-form'
import AddCircleIcon from '@mui/icons-material/AddCircle'
import { ConfiguredControllerHooks } from '@midi-structor/core'

type AddControllerForm = {
  name: string
}

export type AddControllerComponentProps = {}

export const AddControllerComponent: React.FC<
  AddControllerComponentProps
> = ({}) => {
  const {
    handleSubmit,
    formState: { errors, isValid },
    control,
  } = useForm<AddControllerForm>({
    mode: 'onChange',
    defaultValues: {
      name: '',
    },
  })

  const addConfiguredController = ConfiguredControllerHooks.useAddController()

  const onSubmit = (form: AddControllerForm) => {
    addConfiguredController(form.name)
  }

  return (
    <Box>
      <Typography variant='h4'>Add Controller</Typography>
      <Box sx={{ mt: 2 }}>
        <form>
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              gap: 2,
            }}>
            <Box>
              <Controller
                name='name'
                control={control}
                rules={{ required: 'Name is required', minLength: 1 }}
                render={({ field }) => (
                  <TextField
                    size='small'
                    label='Name'
                    variant='outlined'
                    fullWidth={true}
                    error={!!errors.name}
                    helperText={errors.name?.message}
                    {...field}
                  />
                )}
              />
            </Box>
            <Box>
              <Button
                startIcon={<AddCircleIcon />}
                color='success'
                onClick={handleSubmit(onSubmit)}
                disabled={!isValid}
                variant='contained'>
                Add
              </Button>
            </Box>
          </Box>
        </form>
      </Box>
    </Box>
  )
}
