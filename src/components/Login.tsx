import React, { useEffect } from 'react'
import { Box, Button, Form, FormField, Text, Tab, Tabs } from 'grommet'
import { connect } from 'react-redux'
import { ThunkDispatch } from 'redux-thunk'
import { withRouter, RouteComponentProps } from 'react-router-dom'
import styled from 'styled-components'

import { RootState } from '../redux'
import { login, register } from '../redux/session/actions'
import { UserServiceProps } from '../redux/session/reducers'

// this is kindof ugly :/
const StyledTabs = styled(Tabs)`
  div[class^='StyledTabs__StyledTabsHeader'] {
    justify-content: space-around;
  }
`

interface OwnProps {}

interface DispatchProps {
  login: (email: string, password: string) => void
  register: (name: string, email: string, password: string) => void
}

type Props = UserServiceProps & OwnProps & DispatchProps & RouteComponentProps

function Login(props: Props) {
  const doLogin = (event: React.FormEvent<HTMLFormElement>) => {
    const emailEl = event.currentTarget.elements.namedItem(
      'email'
    ) as HTMLInputElement
    const passwordEl = event.currentTarget.elements.namedItem(
      'password'
    ) as HTMLInputElement

    if (
      emailEl &&
      emailEl.value.length > 0 &&
      passwordEl &&
      passwordEl.value.length > 0
    ) {
      props.login(emailEl.value, passwordEl.value)
    }
  }

  const doRegister = (event: React.FormEvent<HTMLFormElement>) => {
    const nameEl = event.currentTarget.elements.namedItem(
      'name'
    ) as HTMLInputElement
    const passwordEl = event.currentTarget.elements.namedItem(
      'password'
    ) as HTMLInputElement
    const emailEl = event.currentTarget.elements.namedItem(
      'email'
    ) as HTMLInputElement

    if (
      nameEl &&
      nameEl.value.length > 0 &&
      emailEl &&
      emailEl.value.length > 0 &&
      passwordEl &&
      passwordEl.value.length > 0
    ) {
      props.register(nameEl.value, emailEl.value, passwordEl.value)
      console.log(
        '[Login] #TODO register',
        nameEl.value,
        emailEl.value,
        passwordEl.value
      )
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
        <StyledTabs>
          <Tab title="Login">
            <Form onSubmit={doLogin}>
              <FormField
                label="email"
                name="email"
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
          </Tab>
          <Tab title="Register">
            <Form onSubmit={doRegister}>
              <FormField
                label="name"
                name="name"
                type="text"
                required
                autoFocus
              />
              <FormField label="email" name="email" type="email" required />
              <FormField
                label="password"
                name="password"
                type="password"
                required
              />

              <FormField
                label="confirm password"
                name="password_confirm"
                type="password"
                required
              />

              <Box direction="row" justify="between" margin={{ top: 'medium' }}>
                <Button
                  type="submit"
                  label="Register"
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
          </Tab>
        </StyledTabs>
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
    login: (email, password) => dispatch(login(email, password)),
    register: (name, password, email) =>
      dispatch(register(name, password, email))
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withRouter(Login))
