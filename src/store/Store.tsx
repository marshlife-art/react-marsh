import React, { useState, useEffect } from 'react'
import { Box, Button, Text } from 'grommet'
import { FormNext } from 'grommet-icons'

import { useAllDocumentsService } from '../services/usePageService'
import { useProductDocService } from '../services/useProductServices'
import { ProductsInfinite } from '../components/ProductsInfinite'
import styled from 'styled-components'

const BreadCrumb = styled(Text)`
  &:hover {
    cursor: pointer;
    text-decoration: underline;
  }
  /* &:hover:after {
    content: 'X';
  } */
`

function Store() {
  const allDocs = useAllDocumentsService('products_wholesale', false)

  const [selectedDoc, setSelectedDoc] = useState()
  const [categories, setCategories] = useState<string[]>([])
  const [selectedCat, setSelectedCat] = useState()

  const productDocResult = useProductDocService(
    'products_wholesale',
    selectedDoc
  )

  const headerDocResult = useProductDocService('products_wholesale', 'header')

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
  useEffect(() => {
    if (
      !selectedDoc ||
      productDocResult.status !== 'loaded' ||
      !productDocResult.payload.data
    ) {
      return
    }
    setCategories(
      productDocResult.payload.data
        .map(p => p[10])
        .filter((cat, index, arr) => arr.indexOf(cat) === index && cat !== '')
    )
  }, [selectedDoc, productDocResult])

  return (
    <Box pad={{ horizontal: 'medium' }} fill>
      <Box
        direction="row"
        width="full"
        gap="small"
        margin={{ bottom: 'medium' }}
      >
        {selectedDoc && (
          <BreadCrumb
            onClick={() => {
              setSelectedDoc(undefined)
              setSelectedCat(undefined)
            }}
          >
            Store
          </BreadCrumb>
        )}
        {selectedDoc && (
          <Text>
            {' '}
            <FormNext />{' '}
          </Text>
        )}
        {selectedDoc && (
          <BreadCrumb
            onClick={() => {
              setSelectedCat(undefined)
            }}
          >
            {selectedDoc}
          </BreadCrumb>
        )}
        {selectedDoc && selectedCat && (
          <Text>
            {' '}
            <FormNext />{' '}
          </Text>
        )}
        {selectedDoc && selectedCat && <Text>{selectedCat}</Text>}
      </Box>
      {!selectedDoc && (
        <Box
          pad={{ horizontal: 'medium', vertical: 'small' }}
          width="medium"
          alignSelf="center"
        >
          {allDocs.status === 'loaded' &&
            allDocs.payload.rows
              .filter(r => r.id !== 'header' && !/^_/.test(r.id))
              .map((row, i) => (
                <Box
                  key={`row${i}`}
                  pad={{ horizontal: 'medium', bottom: 'small' }}
                >
                  <Button
                    fill
                    color="dark-1"
                    onClick={() => setSelectedDoc(row.id)}
                    hoverIndicator
                    style={{ textTransform: 'uppercase' }}
                    label={row.id}
                  />
                </Box>
              ))}
        </Box>
      )}
      {selectedDoc &&
        productDocResult.status === 'loading' &&
        'L O A D I N G . . .'}
      {selectedDoc &&
        !selectedCat &&
        (productDocResult.status === 'loaded' &&
          productDocResult.payload.data && (
            <Box width="auto" alignSelf="center">
              {categories.map((cat, i) => (
                <Box
                  key={`row${i}`}
                  pad={{ horizontal: 'medium', bottom: 'small' }}
                >
                  <Button
                    fill
                    color="dark-1"
                    onClick={() => setSelectedCat(cat)}
                    hoverIndicator
                    style={{ textTransform: 'uppercase' }}
                    label={cat}
                  />
                </Box>
              ))}
            </Box>
          ))}
      {selectedDoc && selectedCat && (
        <ProductsInfinite
          header={
            headerDocResult.status === 'loaded' && headerDocResult.payload.data
              ? headerDocResult.payload.data.map(productMap)
              : undefined
          }
          rows={
            productDocResult.status === 'loaded' &&
            productDocResult.payload.data
              ? productDocResult.payload.data
                  .filter(product => product[10] === selectedCat)
                  .map(productMap)
              : undefined
          }
        />
      )}
    </Box>
  )
}

export { Store }
