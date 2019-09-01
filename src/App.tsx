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
import { grommet } from 'grommet/themes'
import { Cart, UserFemale } from 'grommet-icons'

import { RootState } from './store'
import { UserServiceProps } from './store/session/reducers'
import { checkSession } from './store/session/actions'
import Landing from './components/Landing'
import Login from './components/Login'
import UserMenu from './components/UserMenu'
import CartMenu from './components/CartMenu'
import { StyledLink } from './components/StyledLink'
import { Admin } from './admin/Admin'

interface DispatchProps {
  checkSession: () => void
}

type Props = UserServiceProps & DispatchProps

type SidebarStates = undefined | 'cart' | 'user'

const App: React.FC<Props> = (props: Props) => {
  const [loading, setLoading] = useState(true)
  const [sidebar, setSidebar] = useState<SidebarStates>(undefined)

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
      <Grommet theme={grommet}>
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
          >
            <Box
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

              <Box
                gridArea="header"
                direction="row"
                align="center"
                justify="between"
              >
                <Button
                  onClick={() =>
                    setSidebar(sidebar === 'user' ? undefined : 'user')
                  }
                  icon={<UserFemale />}
                  active={sidebar === 'user'}
                  hoverIndicator
                />
                <Button
                  onClick={() =>
                    setSidebar(sidebar === 'cart' ? undefined : 'cart')
                  }
                  icon={<Cart />}
                  active={sidebar === 'cart'}
                  hoverIndicator
                />
              </Box>
            </Box>

            <Box
              gridArea="main"
              justify="center"
              align="center"
              style={{ minHeight: 'calc(100vh - 54px)' }}
            >
              <Switch>
                <Route exact path="/" component={Landing} />
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

            {sidebar === 'user' && <UserMenu userService={userService} />}
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
