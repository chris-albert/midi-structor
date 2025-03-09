import React from 'react'
import { BrowserRouter, HashRouter, Route, Routes } from 'react-router-dom'
import { Layout } from './pages/Layout'
import { IndexPage } from './pages/IndexPage'
import { ArrangementComponent } from './components/arrangement/ArrangementComponent'
import { MidiPage } from './pages/MidiPage'
import { ControllersPage } from './pages/ControllersPage'
import { SettingsPage } from './pages/SettingsPage'

export type AppRouterProps = {}

const IS_ELECTRON = true

export const AppRouter: React.FC<AppRouterProps> = ({}) => {
  const routes = (
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
  )
  if (IS_ELECTRON) {
    return (
      <HashRouter
        future={{
          v7_relativeSplatPath: true,
          v7_startTransition: true,
        }}>
        {routes}
      </HashRouter>
    )
  } else {
    return (
      <BrowserRouter basename={window.location.pathname.replace(/(\/[^/]+)$/, '')}>{routes}</BrowserRouter>
    )
  }
}
