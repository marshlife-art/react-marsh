import React, { useEffect } from 'react'
import { Box, Button, Form, FormField, Text } from 'grommet'
import { connect } from 'react-redux'
import { ThunkDispatch } from 'redux-thunk'
import { withRouter, RouteComponentProps } from 'react-router-dom'

import { RootState } from '../redux'
import { login } from '../redux/session/actions'
import { UserServiceProps } from '../redux/session/reducers'

interface OwnProps {}

interface DispatchProps {
  login: (username: string, password: string) => void
}

type Props = UserServiceProps & OwnProps & DispatchProps & RouteComponentProps

function Login(props: Props) {
  const doLogin = (event: React.FormEvent<HTMLFormElement>) => {
    const usernameEl = event.currentTarget.elements.namedItem(
      'username'
    ) as HTMLInputElement
    const passwordEl = event.currentTarget.elements.namedItem(
      'password'
    ) as HTMLInputElement

    if (
      usernameEl &&
      usernameEl.value.length > 0 &&
      passwordEl &&
      passwordEl.value.length > 0
    ) {
      props.login(usernameEl.value, passwordEl.value)
    }
  }

  const { userService, history } = props
  // when userService changes, figure out if the page should redirect if a user is already logged in.
  useEffect(() => {
    if (
      userService.user &&
      !userService.isFetching &&
      userService.user.name &&
      userService.user.roles &&
      userService.user.roles.includes('_admin')
    ) {
      history.push('/admin')
    } else if (
      userService.user &&
      !userService.isFetching &&
      userService.user.name
    ) {
      history.push('/')
    }
  }, [userService, history])

  return (
    <Box align="center" justify="center" style={{ minHeight: '100vh' }}>
      <Box width="medium">
        <Form onSubmit={doLogin}>
          <FormField
            label="username"
            name="username"
            type="text"
            required
            autoFocus
          />
          <FormField
            label="password"
            name="password"
            type="password"
            required
          />

          <Box direction="row" justify="between" margin={{ top: 'medium' }}>
            <Button
              type="submit"
              label="Login"
              disabled={props.userService.isFetching}
              primary
            />
          </Box>

          <Box margin={{ top: 'medium' }}>
            {props.userService.user && (
              <Text
                wordBreak="break-all"
                style={{ fontFamily: 'monospace', whiteSpace: 'pre-wrap' }}
                color="status-success"
              >
                {props.userService.user.name}
              </Text>
            )}

            {props.userService.error && (
              <Text
                wordBreak="break-all"
                style={{ fontFamily: 'monospace', whiteSpace: 'pre-wrap' }}
                color="status-critical"
              >
                {props.userService.error.reason}
              </Text>
            )}
          </Box>
        </Form>
      </Box>
    </Box>
  )
}

const mapStateToProps = (
  states: RootState,
  ownProps: OwnProps
): UserServiceProps => {
  return {
    userService: states.session.userService
  }
}

const mapDispatchToProps = (
  dispatch: ThunkDispatch<{}, {}, any>,
  ownProps: OwnProps
): DispatchProps => {
  return {
    login: (username, password) => dispatch(login(username, password))
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withRouter(Login))
