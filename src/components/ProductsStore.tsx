import React, { useState, useRef } from 'react'
import {
  Box,
  InfiniteScroll,
  Table,
  TableRow,
  TableBody,
  TableCell,
  TableHeader,
  Text,
  Button,
  Drop
} from 'grommet'
import { Service } from '../types/Service'
import { ProductDoc } from '../types/Product'
import { Cart } from 'grommet-icons'
import Loading from './Loading'

interface ProductProps {
  row: string[]
}

const PROPERTY_MAP: { [index: string]: string } = {
  a: 'Artificial ingredients',
  c: 'Low carb',
  d: 'Dairy free',
  f: 'Food Service items',
  g: 'Gluten free',
  k: 'Kosher',
  l: 'Low sodium/no salt',
  m: 'Non-GMO Project Verified ',
  og: 'Organic',
  r: 'Refined sugar',
  v: 'Vegan',
  w: 'Yeast free',
  ft: 'Fair Trade',
  n: 'Natural',
  s: 'Specialty Only',
  y: 'Yeast free',
  1: '100% organic',
  2: '95+% organic',
  3: '70%+ organic'
}

function ProductPrice(props: { price: string }) {
  const [a, b] = props.price.split('.')

  return (
    <Box direction="row" justify="center" title="price">
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

function PropertyButton(props: { property: string }) {
  const [open, setOpen] = useState(false)
  const ref = useRef()

  return (
    <>
      <Box
        round
        background="accent-3"
        pad={{ horizontal: 'xsmall', vertical: 'xxsmall' }}
        ref={ref as any}
        onMouseOver={() => setOpen(true)}
        onMouseOut={() => setOpen(false)}
        onFocus={() => setOpen(true)}
        onBlur={() => setOpen(false)}
      >
        <Text size="small">{props.property}</Text>
      </Box>
      {open && (
        <Drop align={{ left: 'right' }} target={ref.current} plain>
          <Box
            pad="xsmall"
            background="dark-3"
            round={{ size: 'medium', corner: 'left' }}
          >
            {PROPERTY_MAP[props.property]}
          </Box>
        </Drop>
      )}
    </>
  )
}

function Product(props: ProductProps) {
  const { row } = props
  return (
    /*  0 Long Name
        1 Advertising Description
        2 PK
        3 Size
        4 Unit Type
        5 W/S Price
        6 U Price
        7->22 properties */

    row && (
      <>
        <TableCell>
          <Box direction="column" pad={{ vertical: 'small' }}>
            <Text size="large" title="brand name">
              {row[0]}
            </Text>
            <Text size="xlarge" title="description">
              {row[1]}
            </Text>
            <Box
              direction="row"
              gap="small"
              align="center"
              margin={{ top: 'xsmall' }}
            >
              <Text size="medium" title="package count">
                {row[2]}ct.
              </Text>
              {row.slice(7, 22).map(r => {
                if (!r || /^\s*$/.test(r)) {
                  // avoid blank stringz
                  return null
                } else {
                  return <PropertyButton key={r} property={r} />
                }
              })}
            </Box>
          </Box>
        </TableCell>

        <TableCell>
          <Box direction="column" pad={{ vertical: 'small' }}>
            {row[5] === row[6] ? (
              <>
                <ProductPrice price={row[5]} />
                <Box gap="small" direction="row">
                  <Text title="size" size="small">
                    {row[3]}
                  </Text>
                </Box>
              </>
            ) : (
              <>
                <ProductPrice price={row[5]} />
                <Text size="small" title="unit price each" textAlign="center">
                  {row[6]} / {row[3]}
                </Text>
              </>
            )}
          </Box>
        </TableCell>

        <TableCell>
          <Box pad={{ vertical: 'small' }}>
            <Button
              plain={false}
              icon={<Cart />}
              onClick={() => {}}
              hoverIndicator
            />
          </Box>
        </TableCell>
      </>
    )
  )
}

interface ProductsStoreProps {
  selectedCat: string
  productDocResult: Service<ProductDoc>
}

function productMap(prod: string[]) {
  return [
    prod[2].trim(),
    prod[3].trim(),
    prod[4],
    prod[5],
    prod[6],
    prod[8],
    prod[9],
    ...prod.slice(11, prod.length)
  ]
}

function ProductsStore(props: ProductsStoreProps) {
  const { selectedCat, productDocResult } = props

  const rows =
    productDocResult.status === 'loaded' && productDocResult.payload.data
      ? productDocResult.payload.data
          .filter(product => product[10] === selectedCat)
          .map(productMap)
      : undefined

  return (
    <Box overflow="auto" width="large" justify="center">
      <Table style={{ tableLayout: 'auto' }}>
        <TableHeader>
          <TableRow>
            <TableCell scope="col"></TableCell>
            <TableCell scope="col"></TableCell>
            <TableCell scope="col"></TableCell>
          </TableRow>
        </TableHeader>
        <TableBody>
          <InfiniteScroll
            renderMarker={marker => (
              <TableRow>
                <TableCell colSpan={3}>
                  <Loading />
                </TableCell>
              </TableRow>
            )}
            // scrollableAncestor="window"
            items={rows}
            // onMore={() => console.log('infinite onMore!')}
            step={100}
          >
            {(row, i) => (
              <TableRow key={i}>
                <Product row={row} />
              </TableRow>
            )}
          </InfiniteScroll>
        </TableBody>
      </Table>
    </Box>
  )
}

export { ProductsStore }
