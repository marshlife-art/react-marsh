import React, { useEffect, useState } from 'react'
import {
  BrowserRouter as Router,
  Route,
  Switch,
  Redirect
} from 'react-router-dom'
import { connect } from 'react-redux'
import { ThunkDispatch } from 'redux-thunk'
import { Grommet, Box, Grid, Button, Text, Stack } from 'grommet'
import { grommet, base } from 'grommet/themes'
import { Cart, Gremlin, Search, Close } from 'grommet-icons'

import { RootState } from './redux'
import { UserServiceProps } from './redux/session/reducers'
import { checkSession } from './redux/session/actions'
import Landing from './components/Landing'
import Login from './components/Login'
import UserMenu from './components/UserMenu'
import CartMenu from './components/CartMenu'
import { StyledLink } from './components/StyledLink'
import { Admin } from './admin/Admin'
import { SearchInput } from './components/SearchInput'
import { Store } from './store/Store'
import styled from 'styled-components'

const StickyBox = styled(Box)`
  position: sticky;
  top: 0;
  background: ${base.global.colors.white};
  z-index: 1;
`

interface DispatchProps {
  checkSession: () => void
}

type Props = UserServiceProps & DispatchProps

type SidebarStates = undefined | 'cart' | 'user'

const App: React.FC<Props> = (props: Props) => {
  const [loading, setLoading] = useState(true)
  const [sidebar, setSidebar] = useState<SidebarStates>(undefined)
  const [showSearch, setShowSearch] = useState(false)
  // checkSession is destructured from props and passed into useEffect
  // which is a bit confusing since checkSession is also imported. ah scope.
  const { checkSession, userService } = props
  useEffect(() => {
    checkSession()
  }, [checkSession])

  useEffect(() => {
    console.log('userService fx:', userService)
    !userService.isFetching && userService.user && setLoading(false)
  }, [userService])

  return (
    <Router>
      <Grommet theme={grommet} cssVars>
        {loading ? (
          'l o a d i n g  .  .  .'
        ) : (
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
              <Text>
                <StyledLink to="/" color="dark-1">
                  MARSH
                </StyledLink>
              </Text>

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
                  onClick={() =>
                    setSidebar(sidebar === 'user' ? undefined : 'user')
                  }
                  icon={<Gremlin />}
                  active={sidebar === 'user'}
                  hoverIndicator
                />
                <Button
                  onClick={() =>
                    setSidebar(sidebar === 'cart' ? undefined : 'cart')
                  }
                  active={sidebar === 'cart'}
                  hoverIndicator
                >
                  <Stack anchor="top-right">
                    <Box margin="small">
                      <Cart />
                    </Box>
                    <Box
                      background="brand"
                      pad={{ horizontal: 'xsmall' }}
                      style={{ marginTop: '-16px', marginRight: '6px' }}
                      round
                    >
                      <Text size="xsmall">6</Text>
                    </Box>
                  </Stack>
                </Button>
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
                <Route exact path="/" component={Landing} />
                <Route exact path="/store" component={Store} />
                <Route exact path="/login" component={Login} />
                {props.userService.user &&
                props.userService.user.roles &&
                props.userService.user.roles.includes('_admin') ? (
                  <Route exact path="/admin" component={Admin} />
                ) : (
                  <Redirect from="/admin" to="/login" />
                )}
              </Switch>
            </Box>

            {sidebar === 'user' && (
              <UserMenu
                userService={userService}
                onClick={() => setSidebar(undefined)}
              />
            )}
            {sidebar === 'cart' && <CartMenu />}
          </Grid>
        )}
      </Grommet>
    </Router>
  )
}

const mapStateToProps = (states: RootState): UserServiceProps => {
  return {
    userService: states.session.userService
  }
}

const mapDispatchToProps = (
  dispatch: ThunkDispatch<{}, {}, any>
): DispatchProps => {
  return {
    checkSession: () => dispatch(checkSession())
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(App)
