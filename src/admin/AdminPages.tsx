import React, { useEffect, useState } from 'react'
import { Box, Button, Heading } from 'grommet'

import { Page } from '../types/Page'
import {
  useAllDocumentsService,
  useDocumentService,
  useDocumentPutService
} from '../services/usePageService'
import { Add } from 'grommet-icons'
import PageEditor from './editors/PageEditor'
import { dateMinSec } from '../util/utilz'
// import ProductsWholesaleEditor from './editors/ProductsWholesaleEditor'
// import OrderEditor from './editors/OrderEditor'
// import { StickyBox } from '../components/StickyBox'

function AdminPagesSidenav(props: {
  setSelectedDocID: (value: React.SetStateAction<string | undefined>) => void
  selectedDocID: string | undefined
}) {
  const { setSelectedDocID, selectedDocID } = props

  const allDocs = useAllDocumentsService('pages')

  return (
    <Box gridArea="side" fill>
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
              onClick={() => setSelectedDocID(`/new_page${dateMinSec()}`)}
            />
          </Box>
        </>
      )}
    </Box>
  )
}

function AdminPages() {
  const [selectedDocID, setSelectedDocID] = useState<string>()

  const doc = useDocumentService('pages', selectedDocID)

  const [selectedPage, setSelectedPage] = useState<Page>()

  const [doSave, setDoSave] = useState(false)
  const [saveMessage, setSaveMessage] = useState('save')

  useEffect(() => {
    saveMessage !== 'save' &&
      window.setTimeout(() => setSaveMessage('save'), 5000)
  }, [saveMessage])

  const putDocResult = useDocumentPutService(
    'pages',
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
    <>
      <AdminPagesSidenav
        {...{
          setSelectedDocID,
          selectedDocID
        }}
      />

      <Box gridArea="main" pad={{ top: 'small' }} fill>
        {selectedPage && (
          <PageEditor
            setSelectedPage={setSelectedPage}
            selectedPage={selectedPage}
            putDocResult={putDocResult}
            saveMessage={saveMessage}
            setDoSave={setDoSave}
          />
        )}
        {!selectedPage && (
          <Box justify="center" align="center" fill>
            <Heading level={2}>select a page to edit</Heading>
            or
            <Heading level={2}>
              <Button
                plain={false}
                label="create a new page"
                icon={<Add />}
                onClick={() => setSelectedDocID(`/new_page${dateMinSec()}`)}
              />
            </Heading>
          </Box>
        )}
      </Box>
    </>
  )
}

export { AdminPages }
