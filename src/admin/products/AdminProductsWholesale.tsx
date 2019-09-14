import React, { useState, useEffect } from 'react'
import { Box, Accordion, AccordionPanel, Text } from 'grommet'

import { useAllDocumentsService } from '../../services/usePageService'
import Loading from '../../components/Loading'
import { ProductMeta, ProductDoc } from '../../types/Product'
// import { catz } from '../../util/utilz'

type AllDocsResponse = PouchDB.Core.AllDocsResponse<any>['rows']

function AdminProductsWholesale() {
  const allDocs = useAllDocumentsService('products_wholesale', true)
  const [wholesaleDocs, setWholesaleDocs] = useState<AllDocsResponse>()

  useEffect(() => {
    console.log('[AdminProductsWholesale] allDocs:', allDocs)
    allDocs.status === 'loaded' && setWholesaleDocs(allDocs.payload.rows)
  }, [allDocs])

  // const [selectedDocID, setSelectedDocID] = useState()
  // // const [rows, setRows] = useState<string[][]>([])

  // const productDocResult = useProductDocService(
  //   'products_wholesale',
  //   selectedDocID
  // )

  // useEffect(() => {
  //   productDocResult.status === 'loaded' &&
  //     productDocResult.payload.data &&
  //     setRows(productDocResult.payload.data)
  // }, [productDocResult])

  // function catz(doc: { data?: string[][] }): string[] {
  //   if (doc && doc.data) {
  //     return doc.data
  //       .map((p: string[]) => p[10])
  //       .filter(
  //         (cat: string, index: number, arr: string[]) =>
  //           arr.indexOf(cat) === index && cat !== ''
  //       )
  //   } else {
  //     return []
  //   }
  // }

  return (
    <>
      <Box
        fill
        justify="center"
        align="center"
        direction="column"
        gap="small"
        pad={{ vertical: 'large' }}
      >
        {allDocs.status !== 'loaded' && <Loading />}
        {allDocs.status === 'loaded' && wholesaleDocs && (
          <Text textAlign="center">
            <b>Total:</b>{' '}
            {wholesaleDocs
              .map(
                ({ doc }: { doc?: ProductDoc }) =>
                  doc && doc.meta && doc.meta.data_length
              )
              .reduce(
                (accumulator, currentValue) =>
                  (accumulator ? accumulator : 0) +
                  (currentValue ? currentValue : 0),
                0
              )}
          </Text>
        )}
        <Accordion animate={true} multiple={false}>
          {wholesaleDocs &&
            wholesaleDocs.map((row, i) => {
              const meta: ProductMeta = row.doc && row.doc.meta
              const catz = meta && meta.catz ? meta.catz : []
              return (
                <AccordionPanel
                  key={`wholesaleCat${i}`}
                  label={
                    row.doc &&
                    row.doc.data &&
                    row.doc.data.length && (
                      <Box
                        direction="row"
                        justify="between"
                        pad={{ vertical: 'small' }}
                        fill
                      >
                        <Text>{row.id}</Text> <Text>({catz.length})</Text>
                      </Box>
                    )
                  }
                >
                  <Box pad={{ horizontal: 'small', bottom: 'small' }}>
                    {catz.map(cat => (
                      <Box
                        direction="row"
                        justify="between"
                        pad={{ vertical: 'small' }}
                        key={`itemforcat${cat.name}`}
                        fill
                      >
                        <Text>{cat.name}</Text>
                        <Text>({cat.count})</Text>
                      </Box>
                    ))}
                    <Box pad={{ top: 'small' }}>
                      <Text textAlign="end">
                        <b>Total:</b> {meta.data_length}
                      </Text>
                    </Box>
                  </Box>
                </AccordionPanel>
              )
            })}
        </Accordion>
      </Box>
    </>
  )
}

export { AdminProductsWholesale }
