import React from 'react'
import { Switch, Route, Redirect } from 'react-router'

import { Box } from 'grommet'

import SidebarButton from '../../components/SidebarButton'
import { AdminProductsLocal } from './AdminProductsLocal'
import { AdminProductsWholesale } from './AdminProductsWholesale'
import { ProductsWholesaleImport } from './ProductsWholesaleImport'

function AdminProducts() {
  return (
    <>
      <Box gridArea="side">
        {/* <SidebarButton label="local" to="/admin/products/local" useActive /> */}
        <SidebarButton
          label="wholesale"
          to="/admin/products/wholesale"
          useActive
        />
        <SidebarButton
          label="import"
          to="/admin/products/wholesale/import"
          useActive
        />
      </Box>

      <Box
        fill
        gridArea="main"
        justify="center"
        align="center"
        overflow="scroll"
      >
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
          <Route
            exact
            path="/admin/products/wholesale/import"
            component={ProductsWholesaleImport}
          />
          <Redirect from="/admin/products" to="/admin/products/wholesale" />
        </Switch>
      </Box>
    </>
  )
}

export { AdminProducts }
