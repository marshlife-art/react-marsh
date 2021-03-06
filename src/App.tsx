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
import { grommet, dark } from 'grommet/themes'

import { RootState } from './redux'
import { UserServiceProps } from './redux/session/reducers'
import { checkSession } from './redux/session/actions'
import { PreferencesServiceProps } from './redux/preferences/reducers'
import { getPreferences } from './redux/preferences/actions'

import Landing from './components/Landing'
import Login from './components/Login'

import { Admin } from './admin/Admin'
import { Store } from './store/Store'
import Loading from './components/Loading'

interface DispatchProps {
  checkSession: () => void
  getPreferences: () => void
}

type Props = UserServiceProps & PreferencesServiceProps & DispatchProps

const App: React.FC<Props> = (props: Props) => {
  const [loading, setLoading] = useState(true)

  // checkSession is destructured from props and passed into useEffect
  // which is a bit confusing since checkSession is also imported. ah scope.
  const {
    checkSession,
    userService,
    getPreferences,
    preferencesService
  } = props

  useEffect(() => {
    getPreferences()
  }, [getPreferences])

  useEffect(() => {
    checkSession()
  }, [checkSession])

  useEffect(() => {
    !userService.isFetching && setLoading(false)
  }, [userService])

  return (
    <Router>
      <Grommet
        theme={
          preferencesService.preferences &&
          preferencesService.preferences.dark_mode === 'true'
            ? dark
            : grommet
        }
      >
        {loading ? (
          <Loading />
        ) : (
          <Switch>
            <Route exact path="/" component={Landing} />
            <Route path="/store" component={Store} />
            <Route exact path="/login" component={Login} />
            {props.userService.user &&
            props.userService.user.roles &&
            props.userService.user.roles.includes('admin') ? (
              <Route path="/admin" component={Admin} />
            ) : (
              <Redirect from="/admin" to="/login" />
            )}
          </Switch>
        )}
      </Grommet>
    </Router>
  )
}

const mapStateToProps = (
  states: RootState
): UserServiceProps & PreferencesServiceProps => {
  return {
    userService: states.session.userService,
    preferencesService: states.preferences.preferencesService
  }
}

const mapDispatchToProps = (
  dispatch: ThunkDispatch<{}, {}, any>
): DispatchProps => {
  return {
    checkSession: () => dispatch(checkSession()),
    getPreferences: () => dispatch(getPreferences())
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(App)
