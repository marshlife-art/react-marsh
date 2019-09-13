import React from 'react'
import { Box } from 'grommet'

import { SidebarButton } from '../../components/SidebarButton'

function AdminProductsLocal() {
  return (
    <>
      <Box gridArea="side" fill>
        <SidebarButton label="products" to="/admin/products" />
      </Box>

      <Box gridArea="main" fill justify="center" align="center">
        AdminProductsLocal
      </Box>
    </>
  )
}

export { AdminProductsLocal }
