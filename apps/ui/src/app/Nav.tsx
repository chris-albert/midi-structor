import React from 'react'
import { AppBar, Box, Toolbar, Grid, Drawer, List } from '@mui/material'
import IconButton from '@mui/material/IconButton'
import MenuIcon from '@mui/icons-material/Menu'
import { NavLinkItem } from './components/NavLinkItem'
import { ProjectsSelectComponent } from './components/projects/ProjectsSelectComponent'
import RefreshIcon from '@mui/icons-material/Refresh'

export type NavProps = {}

export const Nav: React.FC<NavProps> = () => {
  const [menuOpen, setMenuOpen] = React.useState(false)

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position='static'>
        <Drawer
          anchor='left'
          open={menuOpen}
          onClose={() => setMenuOpen(false)}>
          <Box
            role='presentation'
            sx={{ width: 200 }}>
            <List>
              <NavLinkItem
                path='/'
                label='Home'
                onClick={() => setMenuOpen(false)}
              />
              <NavLinkItem
                path='/arrangement'
                label='Arrangement'
                onClick={() => setMenuOpen(false)}
              />
              <NavLinkItem
                path='/midi'
                label='MIDI'
                onClick={() => setMenuOpen(false)}
              />
              <NavLinkItem
                path='/controllers'
                label='Controllers'
                onClick={() => setMenuOpen(false)}
              />
              <NavLinkItem
                path='/settings'
                label='Settings'
                onClick={() => setMenuOpen(false)}
              />
            </List>
          </Box>
        </Drawer>
        <Toolbar>
          <IconButton
            size='small'
            edge='start'
            color='inherit'
            aria-label='menu'
            sx={{ mr: 1 }}
            onClick={() => setMenuOpen(true)}>
            <MenuIcon />
          </IconButton>
          <Grid container>
            <Grid
              item
              xs={6}>
              <Box sx={{ display: 'flex' }}></Box>
            </Grid>
            <Grid
              item
              xs={2}
              container
              justifyContent='center'>
              {/*Center*/}
            </Grid>
            <Grid
              item
              xs={4}
              container
              justifyContent='right'>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <ProjectsSelectComponent />
              </Box>
            </Grid>
          </Grid>
        </Toolbar>
      </AppBar>
    </Box>
  )
}
