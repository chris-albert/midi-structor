import React from 'react'
import {NavLink} from "react-router-dom";
import {ListItem, ListItemButton, ListItemText} from "@mui/material";

export type NavLinkItemProps = {
    path: string
    label: string
    onClick: () => void
}

export const NavLinkItem: React.FC<NavLinkItemProps> = ({
  path,
  label,
  onClick
}) => {
  return (
    <ListItem disablePadding>
        <NavLink
          onClick={onClick}
          to={path}
          style={({isActive}) => ({
            textDecoration: isActive ? 'underline' : "none",
            color: 'white',
            width: '100%'
          })}>
            <ListItemButton>
                <ListItemText primary={label} />
            </ListItemButton>
        </NavLink>
    </ListItem>
  )
}
