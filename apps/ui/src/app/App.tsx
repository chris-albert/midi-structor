import React from 'react'
import './styles.scss'
import { createTheme, CssBaseline, ThemeProvider } from '@mui/material'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { Layout } from './pages/Layout'
import { IndexPage } from './pages/IndexPage'
import { SettingsPage } from './pages/SettingsPage'
import { toast, ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { ArrangementComponent } from './components/arrangement/ArrangementComponent'
import { ControllersPage } from './pages/ControllersPage'
import { MidiPage } from './pages/MidiPage'
import { ProjectHooks } from '@midi-structor/core'
import { MidiAccess } from './midi/MidiAccess'
import { QueryClient, QueryClientProvider } from 'react-query'

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

  ProjectHooks.useOnStatusChange((status) => {
    if (status === 'importing') {
      toast.info('Importing new project.')
    } else if (status === 'done') {
      toast.success(`Successfully imported project!`)
    }
  })

  return (
    <div className='App'>
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>
          <ThemeProvider theme={darkTheme}>
            <ToastContainer position='bottom-right' />
            <CssBaseline />
            <Routes>
              <Route
                path='/'
                element={<Layout />}>
                <Route
                  index
                  element={<IndexPage />}
                />
                <Route
                  path='arrangement'
                  element={<ArrangementComponent />}
                />
                <Route
                  path='midi'
                  element={<MidiPage />}
                />
                <Route
                  path='controllers'
                  element={<ControllersPage />}
                />
                <Route
                  path='settings'
                  element={<SettingsPage />}
                />
              </Route>
            </Routes>
          </ThemeProvider>
        </BrowserRouter>
      </QueryClientProvider>
    </div>
  )
}

export default App
