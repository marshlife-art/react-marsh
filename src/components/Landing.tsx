import React from 'react'
import { Box } from 'grommet'

import { Pages } from './Pages'

function Landing() {
  return (
    <Box pad={{ horizontal: 'medium', vertical: 'small' }}>
      <Pages slug="/" />
    </Box>
  )
}

export default Landing
