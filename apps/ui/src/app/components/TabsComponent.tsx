import React from 'react'
import { Tabs, Tab, Box } from '@mui/material'

export type TabItem = {
  label?: string
  icon?: () => string | React.ReactElement
  content: () => React.ReactElement
}

export type TabsComponentProps = {
  orientation: 'horizontal' | 'vertical'
  tabs: Array<TabItem>
}

export const TabsComponent: React.FC<TabsComponentProps> = ({ orientation, tabs }) => {
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
        sx={{ borderRight: 1, borderColor: 'divider' }}
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
      <Box sx={{ px: 2, flexGrow: 1 }}>{tabs.length > selected ? tabs[selected].content() : null}</Box>
    </Box>
  )
}
