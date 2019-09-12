import React, { useState } from 'react'
import { Switch, Route } from 'react-router'

import Checkout from './Checkout'
import { ProductsWholesale } from './ProductsWholesale'
import { Grid, Box, Button, Text } from 'grommet'
import { StickyBox } from '../components/StickyBox'
import { StyledLink } from '../components/StyledLink'
import { Add, Close, Search, Gremlin } from 'grommet-icons'
import { SearchInput } from '../components/SearchInput'
import CartButton from '../components/CartButton'
import CartMenu from '../components/CartMenu'
import UserMenu from '../components/UserMenu'

type SidebarStates = undefined | 'cart' | 'user'

function Store() {
  const [sidebar, setSidebar] = useState<SidebarStates>(undefined)
  const [showSearch, setShowSearch] = useState(false)

  return (
    <Grid
      fill
      rows={['auto', 'flex']}
      columns={['flex', 'auto']}
      areas={[
        { name: 'header', start: [0, 0], end: [1, 0] },
        { name: 'main', start: [0, 1], end: [0, 1] },
        { name: 'sidebar', start: [1, 1], end: [1, 1] }
      ]}
      style={{ minHeight: '100vh' }}
    >
      <StickyBox
        gridArea="header"
        direction="row"
        align="center"
        justify="between"
        pad={{ horizontal: 'medium', vertical: 'small' }}
      >
        <Box width="169px" direction="row" align="center">
          <Text>
            <StyledLink to="/" color="dark-1">
              MARSH
            </StyledLink>
          </Text>
        </Box>

        <Box direction="row" align="center" justify="between">
          <StyledLink
            to="/store"
            color="dark-1"
            style={{ paddingRight: '1em', paddingLeft: '0.5em' }}
          >
            Store
          </StyledLink>

          {showSearch && <SearchInput />}
          <Button
            onClick={() => setShowSearch(!showSearch)}
            icon={showSearch ? <Close /> : <Search />}
            active={showSearch}
            hoverIndicator
          />

          <Button
            onClick={() => setSidebar(sidebar === 'user' ? undefined : 'user')}
            icon={<Gremlin />}
            active={sidebar === 'user'}
            hoverIndicator
          />
          <Button
            onClick={() => setSidebar(sidebar === 'cart' ? undefined : 'cart')}
            active={sidebar === 'cart'}
            hoverIndicator
          >
            <CartButton />
          </Button>
          {sidebar === 'cart' && (
            <CartMenu onClickOutside={() => setSidebar(undefined)} />
          )}
        </Box>
      </StickyBox>

      <Box
        gridArea="main"
        justify="center"
        align="center"
        // style={{ minHeight: 'calc(100vh - 54px)' }}
        fill
      >
        <Switch>
          <Route exact path="/store" component={ProductsWholesale} />
          <Route exact path="/store/checkout" component={Checkout} />
        </Switch>
      </Box>

      {sidebar === 'user' && <UserMenu onClick={() => setSidebar(undefined)} />}
    </Grid>
  )
}

export { Store }
