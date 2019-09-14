import React from 'react'
import { Box } from 'grommet'

import SidebarButton from '../components/SidebarButton'

function AdminOrders() {
  return (
    <>
      <Box gridArea="side" fill>
        <SidebarButton label="orders" to="/admin/orders" useActive />
      </Box>

      <Box gridArea="main" fill justify="center" align="center">
        ORDERZ
      </Box>
    </>
  )
}

export { AdminOrders }
