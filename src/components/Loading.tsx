import React from 'react'
import { Box, Heading } from 'grommet'
import styled, { keyframes } from 'styled-components'

const fadeIn = keyframes`
  from { opacity: 0; }
  to   { opacity: 1; }
`

const LoadingAnim = styled.div`
  animation: ${fadeIn} 1.5s infinite;
  opacity: 0;
`

function Loading() {
  return (
    <LoadingAnim>
      <Box
        fill
        justify="center"
        align="center"
        pad={{ horizontal: 'medium', vertical: 'small' }}
      >
        <Heading level="4">L O A D I N G . . .</Heading>
      </Box>
    </LoadingAnim>
  )
}

export default Loading
