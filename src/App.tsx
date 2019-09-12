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

import { RootState } from './redux'
import { UserServiceProps } from './redux/session/reducers'
import { checkSession } from './redux/session/actions'
import Landing from './components/Landing'
import Login from './components/Login'

import { Admin } from './admin/Admin'
import { Store } from './store/Store'
import Loading from './components/Loading'

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
          <Loading />
        ) : (
          <Switch>
            <Route exact path="/" component={Landing} />
            <Route path="/store" component={Store} />
            <Route exact path="/login" component={Login} />
            {props.userService.user &&
            props.userService.user.roles &&
            props.userService.user.roles.includes('_admin') ? (
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
