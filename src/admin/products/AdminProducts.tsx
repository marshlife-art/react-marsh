import React from 'react'
import { Switch, Route } from 'react-router'

import { Box } from 'grommet'

import { SidebarButton } from '../../components/SidebarButton'
import { AdminProductsLocal } from './AdminProductsLocal'
import { AdminProductsWholesale } from './AdminProductsWholesale'

function AdminProducts() {
  return (
    <>
      <Box gridArea="side">
        <SidebarButton label="local" to="/admin/products/local" />
        <SidebarButton label="wholesale" to="/admin/products/wholesale" />
      </Box>

      <Box gridArea="main" fill justify="center" align="center">
        <Switch>
          <Route
            exact
            path="/admin/products/local"
            component={AdminProductsLocal}
          />
          <Route
            exact
            path="/admin/products/wholesale"
            component={AdminProductsWholesale}
          />
        </Switch>
      </Box>
    </>
  )
}

export { AdminProducts }
