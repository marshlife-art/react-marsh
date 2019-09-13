import React from 'react'
import { Switch, Route } from 'react-router'
import { Grid, Box, Text, DropButton } from 'grommet'
import { Gremlin } from 'grommet-icons'

import { AdminPages } from './AdminPages'
import { StyledLink } from '../components/StyledLink'
import UserMenu from '../components/UserMenu'
import { Dashboard } from './Dashboard'
import { AdminProducts } from './products/AdminProducts'
import { AdminOrders } from './AdminOrders'

function Admin() {
  return (
    <Grid
      areas={[
        { name: 'header', start: [0, 0], end: [1, 1] },
        { name: 'side', start: [0, 1], end: [1, 2] },
        { name: 'main', start: [1, 0], end: [2, 2] }
      ]}
      columns={['196px', 'auto']}
      rows={['72px', 'auto', 'auto']}
      gap="small"
      style={{ height: '100vh' }}
    >
      <Box
        gridArea="header"
        direction="row"
        pad={{ left: 'medium' }}
        justify="between"
        align="center"
      >
        <Box direction="column" align="start" pad={{ right: 'small' }}>
          <Text>
            <StyledLink to="/" color="dark-1">
              MARSH
            </StyledLink>
          </Text>
          <Text size="small">
            <StyledLink to="/admin" color="dark-1">
              ADMIN
            </StyledLink>
          </Text>
        </Box>

        <DropButton
          icon={<Gremlin />}
          dropAlign={{ top: 'bottom', left: 'left' }}
          dropContent={<UserMenu />}
          hoverIndicator
        />

        {/* <DropButton
          icon={<Add />}
          dropAlign={{ top: 'bottom', left: 'left' }}
          dropContent={<>page</>}
          hoverIndicator
        /> */}
      </Box>

      <Switch>
        <Route exact path="/admin" component={Dashboard} />
        <Route exact path="/admin/pages" component={AdminPages} />
        <Route path="/admin/products" component={AdminProducts} />
        <Route path="/admin/orders" component={AdminOrders} />
      </Switch>
    </Grid>
  )
}

export { Admin }
