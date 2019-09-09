import React, { useState, useEffect } from 'react'
import {
  Box,
  InfiniteScroll,
  Table,
  TableRow,
  TableBody,
  TableCell,
  TableHeader,
  Text,
  Button
} from 'grommet'
import { Service } from '../types/Service'
import { ProductDoc } from '../types/Product'
import { Cart } from 'grommet-icons'
import Loading from './Loading'
import { addToCart } from '../services/useCartService'
import { ProductPriceAndUnit } from './ProductPrice'
import { ProductProperty } from './ProductProperty'

interface ProductProps {
  row: string[]
}

function Product(props: ProductProps) {
  const { row } = props
  const [onAddedMsg, setOnAddedMsg] = useState<string | undefined>(undefined)

  useEffect(() => {
    let timeout: number
    if (onAddedMsg !== undefined) {
      timeout = window.setTimeout(() => {
        setOnAddedMsg(undefined)
      }, 5000)
    }
    return () => {
      timeout && window.clearTimeout(timeout)
    }
  }, [onAddedMsg])

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
            <Box direction="row" gap="small" align="center">
              <Text size="medium" title="package count">
                {row[2]}ct.
              </Text>
              {row.slice(7, 22).map(r => {
                if (!r || /^\s*$/.test(r)) {
                  // avoid blank stringz
                  return null
                } else {
                  return <ProductProperty key={r} property={r} />
                }
              })}
            </Box>
          </Box>
        </TableCell>

        <TableCell>
          <ProductPriceAndUnit
            hasUnitPrice={row[5] === row[6]}
            size={row[3]}
            unitPrice={row[6]}
            price={row[5]}
          />
        </TableCell>

        <TableCell>
          <Box pad={{ vertical: 'small' }} direction="column">
            <Button
              plain={false}
              icon={<Cart />}
              onClick={() => {
                addToCart(row)
                setOnAddedMsg('Added!')
              }}
              hoverIndicator
            />
          </Box>
          <Text size="small">{onAddedMsg}</Text>
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
