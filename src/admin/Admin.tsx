import React from 'react'
import { Anchor, Box } from 'grommet'

export function Admin() {
  return (
    <Box pad={{ horizontal: 'medium', vertical: 'small' }}>
      admin component
      <Anchor href="#" label="zomg" />
    </Box>
  )
}
