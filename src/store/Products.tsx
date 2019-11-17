import React, { useState, useEffect } from 'react'
import {
  DataTable,
  Text,
  Box,
  DataTableProps
  // CheckBox,
  // Table,
  // TableHeader,
  // TableRow,
  // TableCell,
  // TableBody
} from 'grommet'
import { base } from 'grommet/themes'
import styled from 'styled-components'

import { Product } from '../types/Product'
// this, also, is p ugly :/
const StyledDataTable = styled(DataTable)`
  tr div[class^='StyledTextInput__StyledTextInputContainer'] {
    min-width: 175px;
    max-width: 300px;
    position: absolute;
    top: 5px;
    z-index: 3;
    background: ${base.global && base.global.colors
      ? base.global.colors.white
      : 'white'};
  }
`

const PROPERTY_MAP: { [index: string]: string } = {
  a: 'Artificial ingredients',
  c: 'Low carb',
  d: 'Dairy free',
  f: 'Food Service items',
  g: 'Gluten free',
  k: 'Kosher',
  l: 'Low sodium/no salt',
  m: 'Non-GMO Project Verified',
  og: 'Organic',
  r: 'Refined sugar',
  v: 'Vegan',
  w: 'Wheat free',
  ft: 'Fair Trade',
  n: 'Natural',
  s: 'Specialty Only',
  y: 'Yeast free',
  1: '100% organic',
  2: '95%+ organic',
  3: '70%+ organic'
}

function renderCodes(codes: string) {
  return codes.split(', ').map((code, idx) =>
    PROPERTY_MAP[code] ? (
      <Box
        pad={{ horizontal: 'small' }}
        margin="xsmall"
        background="dark-3"
        round={{ size: 'medium', corner: 'left' }}
        key={`pprop${idx}`}
      >
        <Text size="xsmall">{PROPERTY_MAP[code]}</Text>
      </Box>
    ) : (
      ''
    )
  )
}

const COLUMNS: DataTableProps['columns'] = [
  // { header: 'unf', property: 'unf', primary: true },
  {
    header: <Text>category</Text>,
    property: 'category',
    search: true
  },
  {
    header: <Text>sub category</Text>,
    property: 'sub_category',
    search: true
  },
  {
    header: <Text>name</Text>,
    property: 'name',
    search: true
  },
  {
    header: <Text>description</Text>,
    property: 'description',
    search: true
  },
  {
    header: 'pk',
    property: 'pk'
  },
  {
    header: <Text>size</Text>,
    property: 'size'
  },
  {
    header: <Text>unit type</Text>,
    property: 'unit_type',
    search: true
  },
  {
    header: <Text>price</Text>,
    property: 'ws_price'
  },
  {
    header: <Text>unit price</Text>,
    property: 'u_price'
  },
  {
    header: <Text>properties</Text>,
    property: 'codes',
    render: (product: Product) => renderCodes(product.codes),
    search: true
  }
  // { header: 'upc', property: 'upc_code', search: true},
]

function Products() {
  const [products, setProducts] = useState<[Product]>()

  useEffect(() => {
    fetch('http://localhost:3000/products', {
      method: 'post',
      headers: {
        'Content-Type': 'application/json'
      }
      // body: JSON.stringify(query)
    })
      .then(response => response.json())
      .then(result => {
        console.log('products result', result)
        setProducts(result.data)
      })
  }, [])
  return (
    <StyledDataTable
      columns={COLUMNS}
      data={products}
      primaryKey="id"
      // onClickRow={(event: any) =>
      //   console.log('FUCK IS THIS RELEASED YET?! onClick event.datum:', event)
      // }
      sortable
      resizeable
    />
  )
}

export default Products
