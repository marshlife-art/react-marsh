import React, { useState, useEffect } from 'react'
import { Box, Accordion, AccordionPanel, Text } from 'grommet'

import { useAllDocumentsService } from '../../services/usePageService'
import Loading from '../../components/Loading'

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

  function catz(doc: { data?: string[][] }): string[] {
    if (doc && doc.data) {
      return doc.data
        .map((p: string[]) => p[10])
        .filter(
          (cat: string, index: number, arr: string[]) =>
            arr.indexOf(cat) === index && cat !== ''
        )
    } else {
      return []
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

        <Accordion animate={true} multiple={false}>
          {wholesaleDocs &&
            wholesaleDocs.map((row, i) => (
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
                      <Text>{row.id}</Text>{' '}
                      <Text>({catz(row.doc).length})</Text>
                    </Box>
                  )
                }
              >
                <Box pad={{ horizontal: 'small', bottom: 'small' }}>
                  {catz(row.doc).map((item: string) => (
                    <Text key={`itemforcat${item}`}>{item}</Text>
                  ))}
                  <Box pad={{ top: 'small' }}>
                    <Text textAlign="end">
                      <b>Total:</b> {row.doc.data.length}
                    </Text>
                  </Box>
                </Box>
              </AccordionPanel>
            ))}
        </Accordion>
      </Box>
    </>
  )
}

export { AdminProductsWholesale }
