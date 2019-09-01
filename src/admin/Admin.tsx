import React from 'react'
import { Box, Grid } from 'grommet'

export function Admin() {
  return (
    <Box gridArea="main" justify="center" align="center" width="100%">
      <Grid
        fill
        areas={[
          { name: 'nav', start: [1, 0], end: [2, 0] },
          { name: 'side', start: [0, 1], end: [1, 1] },
          { name: 'main', start: [1, 1], end: [2, 1] },
          { name: 'foot', start: [0, 2], end: [2, 2] }
        ]}
        columns={['small', 'flex']}
        rows={['xxsmall', 'large', 'xsmall']}
        gap="small"
      >
        <Box gridArea="nav" background="brand" />
        <Box gridArea="main" background="neutral-1" />
        <Box gridArea="side" background="accent-2" />
        <Box gridArea="foot" background="accent-1" />
      </Grid>
    </Box>
  )
}
