import React, { useRef, useEffect, useState } from 'react'
// import { ThunkDispatch } from 'redux-thunk'
// import { connect } from 'react-redux'
// import styled from 'styled-components'
import { Box, Text, Button, Layer, TextInput, Select } from 'grommet'
import { withRouter, RouteComponentProps } from 'react-router-dom'

import {
  useCartDocService,
  removeItemFromCart,
  emptyCart,
  updateLineItem
} from '../services/useCartService'
import { FormClose, Trash } from 'grommet-icons'
import { ProductPriceAndUnit } from './ProductPrice'
import { ProductProperty } from './ProductProperty'
import { LineItem, UnitType } from '../types/Cart'
import { productMap, productPropMapFn } from '../util/utilz'

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

const Quantity = (props: { line_item: LineItem; idx: number }) => {
  const [qty, setQty] = useState(props.line_item.quantity)
  const [unit, setUnit] = useState(props.line_item.unit_type)

  const onQtyChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseInt(event.target.value)
    const quantity = isNaN(val) || val < 1 ? 1 : val
    setQty(quantity)
    updateLineItem({ ...props.line_item, quantity }, props.idx)
  }

  const onUnitChange = (unit_type: UnitType) => {
    setUnit(unit_type)
    updateLineItem({ ...props.line_item, unit_type }, props.idx)
  }

  const hasUnitPrice =
    props.line_item.data && props.line_item.data[5] !== props.line_item.data[6]

  return (
    <Box direction="row">
      <Box direction="column">
        <Text size="small">Quantity</Text>
        <TextInput
          type="number"
          min={1}
          step={1}
          max={999}
          value={qty}
          onChange={onQtyChange}
          placeholder="Quantity"
          style={{ maxWidth: '71px' }}
        />
      </Box>
      {hasUnitPrice && (
        <Box direction="column" style={{ maxWidth: '97px' }}>
          <Text size="small">Unit</Text>
          <Select
            options={['CS', 'EA']}
            value={unit}
            onChange={({ option }) => onUnitChange(option)}
          />
        </Box>
      )}
    </Box>
  )
}

interface CartMenuProps {
  onClickOutside: () => void
}

const CartMenu = (props: CartMenuProps & RouteComponentProps) => {
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
                        {productMap('name', row)}
                      </Text>
                      <Text size="medium" title="description">
                        {productMap('description', row)}
                      </Text>
                      <Box
                        direction="row"
                        gap="small"
                        align="center"
                        height="24px"
                      >
                        <Text size="xsmall" title="package count">
                          {productMap('pk', row)}ct.
                        </Text>
                        {productPropMapFn(row).map((r, i) => {
                          if (!r || /^\s*$/.test(r)) {
                            // avoid blank stringz
                            return null
                          } else {
                            return <ProductProperty key={r} property={r} />
                          }
                        })}
                      </Box>
                    </Box>
                    <Box
                      justify="between"
                      direction="row"
                      align="center"
                      gap="small"
                    >
                      <Quantity line_item={line_item} idx={idx} />

                      <ProductPriceAndUnit
                        hasUnitPrice={
                          productMap('price', row) !==
                          productMap('unit_price', row)
                        }
                        size={productMap('size', row)}
                        unitPrice={productMap('unit_price', row)}
                        price={productMap('price', row)}
                      />
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
            {/* {cartDocs.status === 'loaded' && cartDocs.payload.line_items && (
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
            )} */}

            {cartDocs.status === 'loaded' && cartDocs.payload.line_items && (
              <Box direction="column" pad={{ right: 'medium' }}>
                <Text>Total</Text>
                <Text size="xlarge" weight="bold">
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
          <Button
            primary
            label="Checkout"
            onClick={() => {
              props.onClickOutside()
              props.history.push('/checkout')
            }}
            hoverIndicator
          />
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

export default withRouter(CartMenu)
