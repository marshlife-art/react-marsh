import React from 'react'
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

interface ProductProps {
  row: string[]
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
        7 a
        r
        c
        l
        d
        f
        g
        v
        w
        y
        k
        ft
        m
        og
        s
        22 n */

    row && (
      <>
        <TableCell>
          <Box direction="column" pad={{ vertical: 'small' }}>
            <Text size="medium" title="brand name">
              {row[0]}
            </Text>
            <Text size="xlarge" title="description">
              {row[1]}
            </Text>
            <Box direction="row" title="properties">
              {row.slice(7, 22).map(
                r =>
                  r !== '' && (
                    <Text key={r} size="small">
                      {r}
                    </Text>
                  )
              )}
            </Box>
          </Box>
        </TableCell>

        <TableCell>
          <Box direction="column" pad={{ vertical: 'small' }}>
            {row[5] === row[6] ? (
              <>
                <Box>
                  <Text size="xlarge" weight="bold" title="price">
                    {row[5]}
                  </Text>
                </Box>
                <Box gap="small" direction="row">
                  <Text title="PK" size="small">
                    {row[2]}
                  </Text>
                  <Text title="size" size="small">
                    {row[3]}
                  </Text>
                </Box>
              </>
            ) : (
              <>
                <Box>
                  <Text size="xlarge" weight="bold" title="price">
                    {row[5]}
                  </Text>
                </Box>
                <Box direction="row" gap="xsmall">
                  <Text size="small" title="PK">
                    {row[2]} {row[3]}
                  </Text>
                  <Text
                    size="small"
                    style={{ fontStyle: 'italic' }}
                    title="price each"
                  >
                    {row[6]} ea.
                  </Text>
                </Box>
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
              <TableRow color="brand">
                <TableCell colSpan={5}>
                  {marker} . . . L O A D I N G _ M O R E _ I T E M S . . .
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
