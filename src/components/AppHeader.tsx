import React from 'react'
import { Box, Text } from 'grommet'
import { UserService } from '../store/session/reducers'

import UserMenu from './UserMenu'
import { StyledLink } from './StyledLink'

interface AppHeaderProps {
  appName: string
  userService: UserService
}

export const AppHeader = ({ appName, userService }: AppHeaderProps) => (
  <Box
    flex={false}
    tag="header"
    direction="row"
    background="white"
    align="center"
    justify="between"
    responsive={false}
  >
    <Box
      pad={{ horizontal: 'medium', vertical: 'small' }}
      responsive={false}
      direction="row"
      align="center"
      gap="small"
    >
      <Text>
        <StyledLink to="/">{appName}</StyledLink>
      </Text>
    </Box>
    <UserMenu alignSelf="center" userService={userService} />
  </Box>
)
