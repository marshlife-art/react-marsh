import React, { useState } from 'react'
import { Switch, Route } from 'react-router'
import { Grid, Box, Button, Text } from 'grommet'
import { Add, Close, Search, Gremlin } from 'grommet-icons'

import { AdminPages } from './AdminPages'
import { StickyBox } from '../components/StickyBox'
import { StyledLink } from '../components/StyledLink'
import { SearchInput } from '../components/SearchInput'
import UserMenu from '../components/UserMenu'

type SidebarStates = undefined | 'user'

function Admin() {
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
        <Box direction="row" justify="end" align="center">
          <Box direction="column" align="end" width={`${192 - 24}px`}>
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
          <Box pad={{ horizontal: 'medium' }}>
            <Button
              // onClick={() => setShowSearch(!showSearch)}
              icon={<Add />}
              hoverIndicator
            />
          </Box>
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
          <Route exact path="/admin" component={AdminPages} />
        </Switch>
      </Box>

      {sidebar === 'user' && <UserMenu onClick={() => setSidebar(undefined)} />}
    </Grid>
  )
}

export { Admin }
