import React, { useEffect, useState } from 'react'
import { Box, Grid, Select, Button, Text } from 'grommet'

import { Page } from '../types/Page'
import {
  useAllDocumentsService,
  useDocumentService,
  useDocumentPutService
} from '../services/usePageService'
import { Add } from 'grommet-icons'
import PageEditor from './editors/PageEditor'
import ProductsWholesaleEditor from './editors/ProductsWholesaleEditor'

export function Admin() {
  const [collection, setCollection] = useState<
    'pages' | 'products_wholesale' | ''
  >('')
  const [selectedDocID, setSelectedDocID] = useState<string>()

  const allDocs = useAllDocumentsService(collection)
  const doc = useDocumentService(collection, selectedDocID)

  const [selectedPage, setSelectedPage] = useState<Page>()

  const [doSave, setDoSave] = useState(false)
  const [saveMessage, setSaveMessage] = useState('save')

  useEffect(() => {
    saveMessage !== 'save' &&
      window.setTimeout(() => setSaveMessage('save'), 5000)
  }, [saveMessage])

  const putDocResult = useDocumentPutService(
    collection,
    selectedPage,
    doSave,
    (rev: string) => {
      selectedPage && setSelectedPage({ ...selectedPage, _rev: rev })
      setSaveMessage('saved!')
    }
  )

  useEffect(() => {
    doSave && setDoSave(false)
  }, [doSave])

  useEffect(() => {
    doc.status === 'loaded' && setSelectedPage(doc.payload)
  }, [doc])

  return (
    <Box gridArea="main" align="stretch" justify="start" fill>
      <Grid
        fill
        areas={[
          { name: 'side', start: [0, 0], end: [1, 0] },
          { name: 'main', start: [1, 0], end: [1, 0] }
        ]}
        columns={['small', 'flex']}
        rows={['full']}
        gap="small"
      >
        <Box gridArea="side" fill>
          <Select
            options={['pages', 'products_wholesale']}
            placeholder="Collections"
            value={collection}
            onChange={({ option }) => {
              setSelectedDocID(undefined)
              setSelectedPage(undefined)
              setCollection(option)
            }}
          />

          {allDocs.status === 'loaded' && (
            <>
              {allDocs.payload.rows.map(row => (
                <Button
                  key={row.id}
                  color="dark-1"
                  hoverIndicator
                  onClick={() => setSelectedDocID(row.id)}
                >
                  <Box
                    pad={{ horizontal: 'medium', vertical: 'small' }}
                    border={
                      selectedDocID === row.id && {
                        side: 'left',
                        color: 'border',
                        size: 'large'
                      }
                    }
                  >
                    {row.id}
                  </Box>
                </Button>
              ))}
              {collection === 'pages' && (
                <Box pad={{ left: 'medium', top: 'medium' }}>
                  <Button
                    plain={false}
                    icon={<Add />}
                    onClick={() => setSelectedDocID('/new_page')}
                  />
                  {/* <Text size="small" textAlign="end">
                  {allDocs.payload.total_rows === 1
                    ? `1 ${collection.replace(/s$/, '')}`
                    : `${allDocs.payload.total_rows} ${collection}`}
                </Text> */}
                </Box>
              )}
            </>
          )}
        </Box>
        <Box gridArea="main" fill>
          {collection === 'pages' && selectedPage && (
            <PageEditor
              setSelectedPage={setSelectedPage}
              selectedPage={selectedPage}
              putDocResult={putDocResult}
              saveMessage={saveMessage}
              setDoSave={setDoSave}
            />
          )}
          {collection === 'products_wholesale' && <ProductsWholesaleEditor />}
        </Box>
      </Grid>
    </Box>
  )
}
