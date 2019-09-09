import React, { useRef, useEffect } from 'react'
// import { ThunkDispatch } from 'redux-thunk'
// import { connect } from 'react-redux'
// import styled from 'styled-components'
import { Box, Text, Button, Layer, TextInput, Select } from 'grommet'
import {
  useCartDocService,
  removeItemFromCart,
  emptyCart
} from '../services/useCartService'
import { FormClose, Trash } from 'grommet-icons'
import { ProductPriceCart } from './ProductPrice'
import { ProductProperty } from './ProductProperty'
import { LineItem } from '../types/Cart'

// import { StyledLink } from './StyledLink'

// export const MenuLink = styled(StyledLink)`
//   &:hover {
//     text-decoration: underline;
//     background: rgba(0, 0, 0, 0.5);
//     color: white;
//   }
// `

// interface CartMenuProps {}
// interface DispatchProps {
//   logout: () => void
// }
// props: CartMenuProps & DispatchProps

const Quantity = () => {
  const [qty, setQty] = React.useState(1)

  const [unit, setUnit] = React.useState('CS')

  const onChange = (event: React.ChangeEvent<HTMLInputElement>) =>
    setQty(parseInt(event.target.value))

  return (
    <Box direction="row">
      <Box direction="column">
        <Text size="small">Quantity</Text>
        <TextInput
          type="number"
          value={qty}
          onChange={onChange}
          placeholder="Quantity"
          style={{ maxWidth: '71px' }}
        />
      </Box>
      <Box direction="column" style={{ maxWidth: '97px' }}>
        <Text size="small">Unit</Text>
        <Select
          options={['CS', 'EA']}
          value={unit}
          onChange={({ option }) => setUnit(option)}
        />
      </Box>
    </Box>
  )
}

const CartMenu = (props: { onClickOutside: () => void }) => {
  const scrollRef = useRef<HTMLDivElement>()
  const scrollRefElem = scrollRef.current

  useEffect(() => {
    if (scrollRefElem) {
      scrollRefElem.scrollTop = scrollRefElem.scrollHeight
    }
  }, [scrollRefElem])

  const cartDocs = useCartDocService()

  return (
    <Layer
      full="vertical"
      position="right"
      onClickOutside={props.onClickOutside}
    >
      <Box fill style={{ minWidth: '450px' }}>
        <Box
          direction="row"
          align="center"
          as="header"
          elevation="small"
          justify="between"
          pad="medium"
        >
          <Text margin={{ left: 'small' }}>Cart</Text>
          <Button
            icon={<FormClose />}
            onClick={props.onClickOutside}
            hoverIndicator
          />
        </Box>
        <Box
          overflow="auto"
          style={{ display: 'block' }}
          ref={scrollRef as any}
        >
          {cartDocs.status === 'loaded' &&
            cartDocs.payload.line_items &&
            cartDocs.payload.line_items.map(
              (line_item: LineItem, idx: number) => {
                const row = line_item.data
                if (!row) {
                  return null
                }
                return (
                  <Box
                    direction="row"
                    key={`cartrow${idx}`}
                    border={idx === 0 ? undefined : 'top'}
                    pad="small"
                    justify="between"
                  >
                    <Box direction="column" pad={{ right: 'small' }}>
                      <Text size="small" title="brand name">
                        {row[0]}
                      </Text>
                      <Text size="medium" title="description">
                        {row[1]}
                      </Text>
                      <Box
                        direction="row"
                        gap="small"
                        align="center"
                        height="24px"
                      >
                        <Text size="xsmall" title="package count">
                          {row[2]}ct.
                        </Text>
                        {row.slice(7, 22).map((r, i) => {
                          if (!r || /^\s*$/.test(r)) {
                            // avoid blank stringz
                            return null
                          } else {
                            return <ProductProperty key={r} property={r} />
                          }
                        })}
                      </Box>
                    </Box>
                    <Box justify="between" direction="row" align="center">
                      <Quantity />

                      <ProductPriceCart price={row[5]} />
                      <Button
                        icon={<Trash color="status-critical" />}
                        margin={{ top: '20px' }}
                        hoverIndicator
                        onClick={() => {
                          if (window.confirm('are you sure?')) {
                            removeItemFromCart(idx)
                          }
                        }}
                      />
                    </Box>
                  </Box>
                )
              }
            )}

          <Box
            border="top"
            pad="medium"
            justify="end"
            direction="row"
            gap="medium"
          >
            {cartDocs.status === 'loaded' && cartDocs.payload.line_items && (
              <Box direction="column">
                <Text>Quantity</Text>
                <Text size="large">
                  {cartDocs.payload.line_items.reduce(
                    (accumulator, currentValue) =>
                      accumulator + currentValue.quantity,
                    0
                  )}
                </Text>
              </Box>
            )}

            {cartDocs.status === 'loaded' && cartDocs.payload.line_items && (
              <Box direction="column">
                <Text>Total</Text>
                <Text size="large" weight="bold">
                  $
                  {cartDocs.payload.line_items
                    .reduce(
                      (accumulator, currentValue) =>
                        accumulator + currentValue.price,
                      0
                    )
                    .toFixed(2)}
                </Text>
              </Box>
            )}
          </Box>
        </Box>
        <Box
          as="footer"
          border={{ side: 'top' }}
          pad="medium"
          justify="between"
          direction="row"
          align="center"
        >
          <Button
            color="status-critical"
            label="Empty Cart"
            hoverIndicator
            onClick={() => {
              if (window.confirm('are you sure?')) {
                emptyCart()
                props.onClickOutside()
              }
            }}
          />
          <Button primary label="Checkout" hoverIndicator />
        </Box>
      </Box>
    </Layer>
  )
}

// const mapDispatchToProps = (
//   dispatch: ThunkDispatch<{}, {}, any>
// ): DispatchProps => {
//   return {
//     logout: () => dispatch(logout())
//   }
// }

// export default connect(
//   undefined,
//   mapDispatchToProps
// )(CartMenu)

export default CartMenu
