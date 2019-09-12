import React, { useState, useEffect } from 'react'
import { Box, InfiniteScroll, Text, Button } from 'grommet'
import { Service } from '../types/Service'
import { ProductDoc } from '../types/Product'
import { Cart } from 'grommet-icons'
import Loading from './Loading'
import { addToCart } from '../services/useCartService'
import { ProductPriceAndUnit } from './ProductPrice'
import { ProductProperty } from './ProductProperty'
import { productMap, productPropMapFn } from '../util/utilz'

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
      <Box direction="row" justify="between" width="large">
        <Box flex="grow">
          <Box direction="column" pad={{ vertical: 'small' }}>
            <Text size="large" title="brand name">
              {productMap('name', row)}
            </Text>
            <Text
              size="xlarge"
              title="description"
              style={{ maxWidth: '550px' }}
            >
              {productMap('description', row)}
            </Text>
            <Box direction="row" gap="small" align="center">
              <Text size="medium" title="package count">
                {productMap('pk', row)}ct.
              </Text>
              {productPropMapFn(row).map(r => {
                if (!r || /^\s*$/.test(r)) {
                  // avoid blank stringz
                  return null
                } else {
                  return <ProductProperty key={r} property={r} />
                }
              })}
            </Box>
          </Box>
        </Box>

        <Box>
          <ProductPriceAndUnit
            hasUnitPrice={
              productMap('price', row) !== productMap('unit_price', row)
            }
            size={productMap('size', row)}
            unitPrice={productMap('unit_price', row)}
            price={productMap('price', row)}
          />
        </Box>

        <Box>
          <Box pad="small" direction="column">
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
        </Box>
      </Box>
    )
  )
}

interface ProductsStoreProps {
  selectedCat: string
  productDocResult: Service<ProductDoc>
}

function ProductsStore(props: ProductsStoreProps) {
  const { selectedCat, productDocResult } = props

  const rows =
    productDocResult.status === 'loaded' && productDocResult.payload.data
      ? productDocResult.payload.data
          .filter(product => product[10] === selectedCat)
          .map((prod: string[]) => [
            prod[2].trim(),
            prod[3].trim(),
            prod[4],
            prod[5],
            prod[6],
            prod[8],
            prod[9],
            ...prod.slice(11, prod.length)
          ])
      : undefined

  return (
    <Box overflow="auto" width="large" justify="center">
      <InfiniteScroll
        renderMarker={marker => (
          <Box>
            {marker}
            <Loading />
          </Box>
        )}
        // scrollableAncestor="window"
        items={rows}
        // onMore={() => console.log('infinite onMore!')}
        step={100}
      >
        {(row, i) => <Product row={row} key={`infpro${i}`} />}
      </InfiniteScroll>
    </Box>
  )
}

export { ProductsStore }
