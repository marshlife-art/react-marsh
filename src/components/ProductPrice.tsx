import React from 'react'
import { Box, Text } from 'grommet'

function ProductPrice(props: { price: string }) {
  const [a, b] = props.price.split('.')

  return (
    <Box direction="row" title="price">
      <Text size="xlarge">$</Text>
      <Text size="xlarge" weight="bold">
        {a.replace('$', '')}
      </Text>
      <Text
        as="sup"
        size="medium"
        style={{
          textDecoration: 'underline',
          marginLeft: '3px',
          fontStyle: 'italic'
        }}
      >
        {b}
      </Text>
    </Box>
  )
}

function ProductPriceAndUnit(props: {
  price: string
  hasUnitPrice: boolean
  size: string
  unitPrice: string
}) {
  return (
    <Box
      direction="column"
      pad={{ vertical: 'small' }}
      width="130px"
      align="center"
    >
      {props.hasUnitPrice ? (
        <>
          <ProductPrice price={props.price} />
          <Text size="small" title="unit price each" textAlign="center">
            {props.unitPrice} / {props.size}
          </Text>
        </>
      ) : (
        <>
          <ProductPrice price={props.price} />
          <Text title="size" size="small">
            {props.size}
          </Text>
        </>
      )}
    </Box>
  )
}

// function ProductPriceCart(props: { price: string }) {
//   return (
//     <Box direction="column" pad={{ left: 'small' }}>
//       <Text size="small">Price</Text>
//       <Box style={{ minHeight: '45px' }} justify="center">
//         <ProductPrice price={props.price} />
//       </Box>
//     </Box>
//   )
// }

export { ProductPriceAndUnit }
