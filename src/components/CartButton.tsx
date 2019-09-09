import React from 'react'
import { Stack, Box, Text } from 'grommet'
import { Cart } from 'grommet-icons'
import { useCartItemCount } from '../services/useCartService'

function CartButton() {
  const cartItemCount = useCartItemCount()

  if (cartItemCount === 0) {
    return null
  }

  return (
    <Stack anchor="top-right">
      <Box margin="small">
        <Cart />
      </Box>
      <Box
        background="brand"
        pad={{ horizontal: 'xsmall' }}
        style={{ marginTop: '-16px', marginRight: '6px' }}
        round
      >
        <Text size="xsmall">{cartItemCount}</Text>
      </Box>
    </Stack>
  )
}

export default CartButton
