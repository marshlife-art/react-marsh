import React, { useState } from 'react'
import { Switch, Route } from 'react-router'
import { Box, Button, Text, DropButton } from 'grommet'
import { Gremlin } from 'grommet-icons'
import styled from 'styled-components'

import Checkout from './Checkout'
import Products from './Products'
import { StyledLink } from '../components/StyledLink'
import SearchBox from '../components/SearchBox'
import CartButton from '../components/CartButton'
import CartMenu from '../components/CartMenu'
import UserMenu from '../components/UserMenu'
import StoreSearch from './StoreSearch'

const StoreHeader = styled(Box)`
  position: fixed;
  top: 0;
  right: 0;
  height: 106px;
  z-index: 2;
`

function Store() {
  const [showCart, setShowCart] = useState(false)

  return (
    <>
      <SearchBox />

      <StoreHeader
        direction="column"
        align="center"
        justify="between"
        margin={{ right: 'medium' }}
        pad={{ horizontal: 'small', vertical: 'small' }}
        background="dark-1"
      >
        <Box direction="row" align="start">
          <Text size="large">
            <StyledLink to="/" color="light-1">
              MARSH
            </StyledLink>
          </Text>
        </Box>

        <Box direction="row" align="center" justify="between">
          {/* <StyledLink
            to="/store"
            color="dark-1"
            style={{ paddingRight: '1em', paddingLeft: '0.5em' }}
          >
            Store
          </StyledLink> */}

          <DropButton
            icon={<Gremlin />}
            dropAlign={{ top: 'bottom', right: 'right' }}
            dropContent={<UserMenu />}
            hoverIndicator
          />

          <Button
            onClick={() => setShowCart(!showCart)}
            active={showCart}
            hoverIndicator
          >
            <CartButton />
          </Button>
          {showCart && <CartMenu onClickOutside={() => setShowCart(false)} />}
        </Box>
      </StoreHeader>

      <Box justify="center" align="center" fill>
        <Switch>
          <Route exact path="/store" component={Products} />
          <Route exact path="/store/checkout" component={Checkout} />
          <Route exact path="/store/search" component={StoreSearch} />
        </Switch>
      </Box>
    </>
  )
}

export { Store }
