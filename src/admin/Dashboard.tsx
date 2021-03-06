import React from 'react'
import { Box } from 'grommet'

import SidebarButton from '../components/SidebarButton'

function Dashboard() {
  return (
    <>
      <Box gridArea="side" fill>
        <SidebarButton label="pages" to="/admin/pages" />
        <SidebarButton label="products" to="/admin/products" />
        <SidebarButton label="orders" to="/admin/orders" />
      </Box>

      <Box gridArea="main" fill justify="center" align="center">
        M A R S H
      </Box>
    </>
  )
}

export { Dashboard }
