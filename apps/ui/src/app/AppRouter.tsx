import React from 'react'
import { BrowserRouter, HashRouter, Route, Routes } from 'react-router-dom'
import { Layout } from './pages/Layout'
import { ArrangementComponent } from './components/arrangement/ArrangementComponent'
import { MidiPage } from './pages/MidiPage'
import { ControllersPage } from './pages/ControllersPage'
import { SettingsPage } from './pages/SettingsPage'
import { UIPage } from './pages/UIPage'
import { ProjectSettingsRawComponent } from './components/settings/ProjectSettingsRawComponent'

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
          element={<ControllersPage />}
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
        <Route
          path='settings/project'
          element={<ProjectSettingsRawComponent />}
        />
        <Route
          path='ui'
          element={<UIPage />}
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
      <BrowserRouter
        basename={window.location.pathname.replace(/(\/[^/]+)$/, '')}>
        {routes}
      </BrowserRouter>
    )
  }
}
