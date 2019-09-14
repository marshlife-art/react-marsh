import React from 'react'
import { withRouter, RouteComponentProps } from 'react-router-dom'
import { Button, Box, Text } from 'grommet'

import { StyledLink } from './StyledLink'

const SidebarButton = ({
  label,
  to,
  useActive = false,
  location,
  ...rest
}: {
  label: string
  to: string
  useActive?: boolean
} & RouteComponentProps) => (
  <Button plain {...rest}>
    {({ hover }: { hover: boolean }) => (
      <StyledLink color="dark-1" to={to}>
        <Box
          background={
            hover || (useActive && location.pathname === to)
              ? 'accent-1'
              : undefined
          }
          pad={{ horizontal: 'large', vertical: 'medium' }}
        >
          <Text size="large">{label}</Text>
        </Box>
      </StyledLink>
    )}
  </Button>
)

export default withRouter(SidebarButton)
