import React, { useState } from 'react'
import { Switch, Route } from 'react-router'
import { base } from 'grommet/themes'

import Checkout from './Checkout'
import { ProductsWholesale } from './ProductsWholesale'
import { Box, Button, Text, DropButton } from 'grommet'
import { StickyBox } from '../components/StickyBox'
import { StyledLink } from '../components/StyledLink'
import { Close, Search, Gremlin } from 'grommet-icons'
import { SearchInput } from '../components/SearchInput'
import CartButton from '../components/CartButton'
import CartMenu from '../components/CartMenu'
import UserMenu from '../components/UserMenu'
import styled from 'styled-components'

const StoreHeader = styled(Box)`
  position: fixed;
  top: 0;
  right: 0;
  height: 106px;
  z-index: 2;
`

const SearchBox = styled(Box)`
  position: sticky;
  top: 0;
  z-index: 3;
  background: ${base.global.colors.white};
`

function Store() {
  const [showCart, setShowCart] = useState(false)
  const [showSearch, setShowSearch] = useState(false)

  return (
    <>
      {showSearch ? (
        <SearchBox
          direction="row"
          margin={{ horizontal: 'medium' }}
          pad={{ vertical: 'small' }}
          style={{ width: '500px' }}
        >
          <Button
            onClick={() => setShowSearch(false)}
            icon={<Close />}
            active={showSearch}
            hoverIndicator
          />
          <SearchInput />
        </SearchBox>
      ) : (
        <StickyBox
          top="0px"
          direction="row"
          pad={{ horizontal: 'medium', vertical: 'small' }}
          style={{ width: `${24 + 48}px` }}
        >
          <Button
            onClick={() => setShowSearch(true)}
            icon={<Search />}
            active={showSearch}
            hoverIndicator
          />
        </StickyBox>
      )}

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
          <Route exact path="/store" component={ProductsWholesale} />
          <Route exact path="/store/checkout" component={Checkout} />
        </Switch>
      </Box>
    </>
  )
}

export { Store }
