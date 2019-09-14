import React, { useState, useEffect } from 'react'
import { Box, Accordion, AccordionPanel, Text, Button } from 'grommet'

import { useAllDocumentsService } from '../../services/usePageService'
import Loading from '../../components/Loading'
import { ProductMeta, ProductDoc } from '../../types/Product'
import { Trash } from 'grommet-icons'
import { deleteDoc } from '../../services/useProductServices'
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

  function tryGetDate(doc: ProductDoc): string {
    try {
      return doc && doc.meta
        ? new Date(doc.meta.date_added).toLocaleDateString()
        : ''
    } catch (e) {
      console.warn('tryGetTime caught error:', e)
      return ''
    }
  }

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
                        <Text>{row.id}</Text>
                        <Text>
                          <b>{catz.length}</b>
                        </Text>
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
                        <Text margin={{ right: 'small' }}>{cat.name}</Text>
                        <Text>
                          <b>{cat.count}</b>
                        </Text>
                      </Box>
                    ))}
                    <Box
                      pad={{ top: 'small' }}
                      justify="between"
                      direction="row"
                      align="center"
                    >
                      <Button
                        icon={<Trash color="status-error" />}
                        color="status-error"
                        onClick={() => {
                          if (
                            window.confirm(
                              `are you sure you want to delete ${row.id}?`
                            )
                          ) {
                            deleteDoc('products_wholesale', row.id)
                          }
                        }}
                        title="delete"
                        hoverIndicator
                      />
                      <Text size="small">
                        <i>added on: {tryGetDate(row.doc)}</i>
                      </Text>
                      <Text textAlign="end">
                        Total: <b>{meta.data_length}</b>
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
