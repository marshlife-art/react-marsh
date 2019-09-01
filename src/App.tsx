import React, { useEffect, useState } from 'react'
import {
  BrowserRouter as Router,
  Route,
  Switch,
  Redirect
} from 'react-router-dom'
import { connect } from 'react-redux'
import { ThunkDispatch } from 'redux-thunk'

import { Grommet } from 'grommet'
import { grommet } from 'grommet/themes'

import { RootState } from './store'
import Landing from './components/Landing'
import Login from './components/Login'
import { AppHeader } from './components/AppHeader'
import { UserServiceProps } from './store/session/reducers'
import { Admin } from './admin/Admin'
import { checkSession } from './store/session/actions'

interface DispatchProps {
  checkSession: () => void
}

type Props = UserServiceProps & DispatchProps

const App: React.FC<Props> = (props: Props) => {
  const [loading, setLoading] = useState(true)

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
          <>
            <AppHeader appName="MARSH" userService={props.userService} />
            <Switch>
              <Route exact path="/" component={Landing} />
              <Route exact path="/login" component={Login} />
              {props.userService.user ? (
                <Route exact path="/admin" component={Admin} />
              ) : (
                <Redirect from="/admin" to="/login" />
              )}
            </Switch>
          </>
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
