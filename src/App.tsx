import React, { useEffect, useState } from 'react'
import {
  BrowserRouter as Router,
  Route,
  Switch,
  Redirect
} from 'react-router-dom'
import { connect } from 'react-redux'
import { ThunkDispatch } from 'redux-thunk'
import { Grommet, Box, Grid, Button, Text } from 'grommet'
import { grommet, base } from 'grommet/themes'
import { Gremlin, Search, Close } from 'grommet-icons'

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
import Loading from './components/Loading'
import CartButton from './components/CartButton'
import Checkout from './store/Checkout'

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
      {/* cssVars */}
      <Grommet theme={grommet}>
        {loading ? (
          <Loading />
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
                <Route exact path="/checkout" component={Checkout} />
              </Switch>
            </Box>

            {sidebar === 'user' && (
              <UserMenu
                userService={userService}
                onClick={() => setSidebar(undefined)}
              />
            )}
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
