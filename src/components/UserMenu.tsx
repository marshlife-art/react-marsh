import React from 'react'
import { ThunkDispatch } from 'redux-thunk'
import { connect } from 'react-redux'
import styled from 'styled-components'
import { Box } from 'grommet'
// import { UserFemale } from 'grommet-icons'

import { UserService } from '../store/session/reducers'
import { logout } from '../store/session/actions'
import { StyledLink } from './StyledLink'

export const MenuLink = styled(StyledLink)`
  &:hover {
    text-decoration: underline;
    background: rgba(0, 0, 0, 0.5);
    color: white;
  }
`

interface UserMenuProps {
  userService: UserService
}

interface DispatchProps {
  logout: () => void
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
    >
      {props.userService.user && props.userService.user.name ? (
        <>
          {props.userService.user.roles &&
            props.userService.user.roles.includes('_admin') && (
              <MenuLink to="/admin" color="dark-1">
                <Box pad={{ horizontal: 'medium', vertical: 'small' }}>
                  admin
                </Box>
              </MenuLink>
            )}
          <MenuLink to="/" onClick={() => props.logout()} color="dark-1">
            <Box pad={{ horizontal: 'medium', vertical: 'small' }}>logout</Box>
          </MenuLink>
        </>
      ) : (
        <MenuLink to="/login" color="dark-1">
          <Box pad={{ horizontal: 'medium', vertical: 'small' }}>login</Box>
        </MenuLink>
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
