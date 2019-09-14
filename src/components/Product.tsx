import React, { useState, useEffect } from 'react'
import { Box, Text, Button } from 'grommet'
import { Cart } from 'grommet-icons'

import { addToCart } from '../services/useCartService'
import { ProductPriceAndUnit } from './ProductPrice'
import { ProductProperty } from './ProductProperty'
import { productMapFn, productPropMapFn } from '../util/utilz'
import { ProductMap } from '../types/Product'

interface ProductProps {
  row: string[]
  productMap?: ProductMap
  preview?: boolean
}

export function Product(props: ProductProps) {
  const { row } = props

  const productMap = (key: keyof ProductMap, row: string[]) =>
    productMapFn(key, row, props.productMap)

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
              {productPropMapFn(row, props.productMap).map(r => {
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
              disabled={props.preview}
              hoverIndicator
            />
          </Box>
          <Text size="small">{onAddedMsg}</Text>
        </Box>
      </Box>
    )
  )
}
