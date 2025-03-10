import React from 'react'
import './styles.scss'
import { createTheme, CssBaseline, ThemeProvider } from '@mui/material'
import { toast, ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { MidiAccess } from './midi/MidiAccess'
import { QueryClient, QueryClientProvider } from 'react-query'
import { AppRouter } from './AppRouter'

const darkTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#1976d2',
    },
  },
})

const queryClient = new QueryClient()

function App() {
  MidiAccess.useAccess()

  // ProjectHooks.useOnStatusChange((status) => {
  //   if (status === 'importing') {
  //     toast.info('Importing new project.')
  //   } else if (status === 'done') {
  //     toast.success(`Successfully imported project!`)
  //   }
  // })

  return (
    <div className='App'>
      <QueryClientProvider client={queryClient}>
        <ThemeProvider theme={darkTheme}>
          <ToastContainer position='bottom-right' />
          <CssBaseline />
          <AppRouter />
        </ThemeProvider>
      </QueryClientProvider>
    </div>
  )
}

export default App
