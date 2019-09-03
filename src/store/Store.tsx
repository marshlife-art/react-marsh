import React, { useState } from 'react'
import { Box, Button } from 'grommet'

import { useAllDocumentsService } from '../services/usePageService'
import { useProductDocService } from '../services/useProductServices'
import { ProductsInfinite } from '../components/ProductsInfinite'

// import { ProductDoc } from '../types/Product'

function Store() {
  const allDocs = useAllDocumentsService('products_wholesale', false)

  const [selectedDoc, setSelectedDoc] = useState()

  const productDocResult = useProductDocService(
    'products_wholesale',
    selectedDoc
  )

  const headerDocResult = useProductDocService('products_wholesale', 'header')

  return (
    <>
      {!selectedDoc && (
        <Box pad={{ horizontal: 'medium', vertical: 'small' }}>
          {allDocs.status === 'loaded' &&
            allDocs.payload.rows
              .filter(r => r.id !== 'header')
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
      {selectedDoc && (
        <ProductsInfinite
          header={
            headerDocResult.status === 'loaded'
              ? headerDocResult.payload.data
              : undefined
          }
          rows={
            productDocResult.status === 'loaded'
              ? productDocResult.payload.data
              : undefined
          }
        />
      )}
    </>
  )
}

export { Store }
