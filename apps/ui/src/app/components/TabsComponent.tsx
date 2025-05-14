import React from 'react'
import { Tabs, Tab, Box } from '@mui/material'
import { SxProps } from '@mui/system'
import { Theme } from '@mui/material/styles'

export type TabItem = {
  label?: string
  icon?: () => string | React.ReactElement
  content: () => React.ReactElement
}

export type TabsComponentProps = {
  orientation: 'horizontal' | 'vertical'
  tabs: Array<TabItem>
  slotProps?: {
    tabs?: {
      sx?: SxProps<Theme>
    }
  }
}

export const TabsComponent: React.FC<TabsComponentProps> = ({
  orientation,
  tabs,
  slotProps,
}) => {
  const [selected, setSelected] = React.useState(0)

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setSelected(newValue)
  }

  React.useEffect(() => {
    setSelected(0)
  }, [tabs])

  return (
    <Box sx={{ flexGrow: 1, display: 'flex', height: '100%' }}>
      <Tabs
        sx={{
          ...slotProps?.tabs?.sx,
          borderRight: 1,
          borderColor: 'divider',
          minWidth: '90px',
        }}
        orientation={orientation}
        value={selected}
        onChange={handleChange}>
        {tabs.map((tab, index) => (
          <Tab
            key={`tab-${index}`}
            label={tab.label}
            icon={tab.icon !== undefined ? tab.icon() : undefined}
          />
        ))}
      </Tabs>
      <Box sx={{ p: 2, flexGrow: 1 }}>
        {
          // @ts-ignore
          tabs.length > selected ? tabs[selected].content() : null
        }
      </Box>
    </Box>
  )
}
