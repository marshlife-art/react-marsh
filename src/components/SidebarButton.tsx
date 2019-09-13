import React from 'react'
import { Button, Box, Text } from 'grommet'

import { StyledLink } from './StyledLink'

const SidebarButton = ({
  label,
  to,
  ...rest
}: {
  label: string
  to: string
}) => (
  <Button plain {...rest}>
    {({ hover }: { hover: boolean }) => (
      <StyledLink color="dark-1" to={to}>
        <Box
          background={hover ? 'accent-1' : undefined}
          pad={{ horizontal: 'large', vertical: 'medium' }}
        >
          <Text size="large">{label}</Text>
        </Box>
      </StyledLink>
    )}
  </Button>
)

export { SidebarButton }
