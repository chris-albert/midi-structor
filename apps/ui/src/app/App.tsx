import React from 'react'
import './styles.scss'
import { createTheme, CssBaseline, ThemeProvider } from '@mui/material'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { QueryClient, QueryClientProvider } from 'react-query'
import { AppRouter } from './AppRouter'
import { MidiRoot } from './components/midi/MidiRoot'

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
  return (
    <div className='App'>
      <QueryClientProvider client={queryClient}>
        <ThemeProvider theme={darkTheme}>
          <ToastContainer position='bottom-right' />
          <CssBaseline />
          <MidiRoot />
          <AppRouter />
        </ThemeProvider>
      </QueryClientProvider>
    </div>
  )
}

export default App
