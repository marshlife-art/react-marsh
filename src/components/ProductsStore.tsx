import React from 'react'
import { Box, InfiniteScroll } from 'grommet'

import { Product } from './Product'
import { Service } from '../types/Service'
import { ProductDoc } from '../types/Product'
import Loading from './Loading'
import { productMapFn } from '../util/utilz'

interface ProductsStoreProps {
  selectedCat: string
  productDocResult: Service<ProductDoc>
}

function ProductsStore(props: ProductsStoreProps) {
  const { selectedCat, productDocResult } = props
  const productMap =
    productDocResult.status === 'loaded'
      ? productDocResult.payload.product_map
      : undefined

  const rows =
    productDocResult.status === 'loaded' && productDocResult.payload.data
      ? productDocResult.payload.data.filter(
          product =>
            productMapFn('category', product, productMap) === selectedCat
        )
      : undefined

  return (
    <Box overflow="auto" width="large" justify="center" alignSelf="center">
      <InfiniteScroll
        renderMarker={marker => (
          <Box>
            {marker}
            <Loading />
          </Box>
        )}
        items={rows}
        step={100}
      >
        {(row, i) => (
          <Product row={row} productMap={productMap} key={`infpro${i}`} />
        )}
      </InfiniteScroll>
    </Box>
  )
}

export { ProductsStore }
