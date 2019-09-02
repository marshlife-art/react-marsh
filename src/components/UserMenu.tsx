import React from 'react'
import { ThunkDispatch } from 'redux-thunk'
import { connect } from 'react-redux'
import { Box } from 'grommet'

import { UserService } from '../store/session/reducers'
import { logout } from '../store/session/actions'
import { MenuLink } from './StyledLink'

interface UserMenuProps {
  userService: UserService
  onClick: () => void
}

interface DispatchProps {
  logout: () => void
}

const UserMenuLink = (props: {
  to: string
  label: string
  onClick?: () => void
}) => {
  return (
    <MenuLink
      to={props.to}
      onClick={() => props.onClick && props.onClick()}
      color="dark-1"
    >
      <Box
        pad={{ horizontal: 'medium', vertical: 'small' }}
        border={{
          side: 'right',
          color: 'border',
          size: 'large'
        }}
      >
        {props.label}
      </Box>
    </MenuLink>
  )
}

const UserMenu = (props: UserMenuProps & DispatchProps) => {
  return (
    <Box
      gridArea="sidebar"
      width="small"
      animation={[
        { type: 'fadeIn', duration: 300 },
        { type: 'slideLeft', size: 'xlarge', duration: 150 }
      ]}
      onClick={props.onClick}
    >
      {props.userService.user && props.userService.user.name ? (
        <>
          {props.userService.user.roles &&
            props.userService.user.roles.includes('_admin') && (
              <UserMenuLink to="/admin" label="admin" />
            )}
          <UserMenuLink to="/" onClick={() => props.logout()} label="logout" />
        </>
      ) : (
        <UserMenuLink to="/login" label="login" />
      )}
    </Box>
  )
}

const mapDispatchToProps = (
  dispatch: ThunkDispatch<{}, {}, any>
): DispatchProps => {
  return {
    logout: () => dispatch(logout())
  }
}

export default connect(
  undefined,
  mapDispatchToProps
)(UserMenu)
