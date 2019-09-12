import React, { useEffect, useState } from 'react'
import { Box, Grid, Button, Accordion, AccordionPanel } from 'grommet'

import { Page } from '../types/Page'
import {
  useAllDocumentsService,
  useDocumentService,
  useDocumentPutService
} from '../services/usePageService'
import { Add } from 'grommet-icons'
import PageEditor from './editors/PageEditor'
import ProductsWholesaleEditor from './editors/ProductsWholesaleEditor'
import OrderEditor from './editors/OrderEditor'

type KnownCollectionNames = '' | 'pages' | 'products_wholesale' | 'orders'

function AdminPages() {
  const [collection, setCollection] = useState<KnownCollectionNames>('')
  const [selectedDocID, setSelectedDocID] = useState<string>()

  const allDocs = useAllDocumentsService(collection)
  const doc = useDocumentService(collection, selectedDocID)

  const [selectedPage, setSelectedPage] = useState<Page>()

  const [doSave, setDoSave] = useState(false)
  const [saveMessage, setSaveMessage] = useState('save')

  const [actionModalOpen, setActionModalOpen] = useState(false)

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

  function newAction() {
    switch (collection) {
      case 'pages':
        setSelectedDocID('/new_page')
        break
      case 'products_wholesale':
        console.log('products_wholesale')
        setActionModalOpen(true)
        break
      default:
        console.log('newAction has nothing to do')
        break
    }
  }

  const sidePanelCollections: Array<KnownCollectionNames> = [
    'pages',
    'products_wholesale',
    'orders'
  ]

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
          <Accordion
            onActive={(activeIndexes: number[]) => {
              setSelectedDocID(undefined)
              setSelectedPage(undefined)
              setCollection(sidePanelCollections[activeIndexes[0]])
            }}
          >
            {sidePanelCollections.map((collection: string, idx: number) => (
              <AccordionPanel
                label={
                  <Box pad={{ left: 'medium', vertical: 'small' }}>
                    {/products/.test(collection) ? 'products' : collection}
                  </Box>
                }
                key={`sidePanel${idx}`}
                style={{ wordBreak: 'break-all' }}
              >
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
                    <Box pad="medium">
                      <Button
                        plain={false}
                        icon={<Add />}
                        onClick={() => newAction()}
                      />
                    </Box>
                  </>
                )}
              </AccordionPanel>
            ))}
          </Accordion>

          {/* <Box pad={{ left: 'medium' }}>
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
          </Box> */}
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
          {collection === 'products_wholesale' && (
            <ProductsWholesaleEditor
              {...{ actionModalOpen, setActionModalOpen, selectedDocID }}
            />
          )}
          {collection === 'orders' && <OrderEditor doc={doc} />}
        </Box>
      </Grid>
    </Box>
  )
}

export { AdminPages }
