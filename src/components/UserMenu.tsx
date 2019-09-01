import React, { useState } from 'react'
import { DropButton, Box, MenuProps } from 'grommet'
import { UserFemale } from 'grommet-icons'

import { StyledLink } from './StyledLink'
import { UserService } from '../store/session/reducers'
import { logout } from '../store/session/actions'
import { ThunkDispatch } from 'redux-thunk'
import { connect } from 'react-redux'

interface UserMenuProps {
  alignSelf: MenuProps['alignSelf']
  userService: UserService
}

interface DispatchProps {
  logout: () => void
}

const UserMenu = (props: UserMenuProps & DispatchProps) => {
  const [open, setOpen] = useState(false)

  return (
    <Box
      pad={{ horizontal: 'medium', vertical: 'small' }}
      responsive={false}
      direction="row"
      align="center"
      gap="small"
    >
      {props.userService.user && props.userService.user.name ? (
        <DropButton
          open={open}
          onClose={() => setOpen(false)}
          dropAlign={{ right: 'right', top: 'bottom' }}
          dropContent={
            <Box
              direction="column"
              justify="between"
              onClick={() => setOpen(false)}
              margin={{ right: 'medium' }}
              pad={{ horizontal: 'medium', vertical: 'small' }}
            >
              hi {props.userService.user.name}!
              <hr />
              {props.userService.user.roles &&
                props.userService.user.roles.includes('_admin') && (
                  <StyledLink to="/admin">admin</StyledLink>
                )}
              <StyledLink to="/" onClick={() => props.logout()}>
                logout
              </StyledLink>
            </Box>
          }
        >
          <UserFemale onClick={() => setOpen(!open)} />
        </DropButton>
      ) : (
        <StyledLink to="/login">login</StyledLink>
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
