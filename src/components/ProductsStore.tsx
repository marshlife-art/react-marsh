import React from 'react'
import { Box, InfiniteScroll } from 'grommet'

import { Product } from './Product'
import { Service } from '../types/Service'
import { ProductDoc } from '../types/Product'
import Loading from './Loading'

interface ProductsStoreProps {
  selectedCat: string
  productDocResult: Service<ProductDoc>
}

function ProductsStore(props: ProductsStoreProps) {
  const { selectedCat, productDocResult } = props

  // #TODO: use a generated product map...
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
    <Box overflow="auto" width="large" justify="center" alignSelf="center">
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
