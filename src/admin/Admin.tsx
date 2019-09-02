import React, { useEffect, useState } from 'react'
import { Box, Grid, Select, Button, Text, TextArea, TextInput } from 'grommet'

import { Page } from '../types/Page'
import {
  useAllDocumentsService,
  useDocumentService,
  useDocumentPutService
} from '../services/usePageService'
import { Add } from 'grommet-icons'

export function Admin() {
  const [collection, setCollection] = useState('')
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
    <Box
      gridArea="main"
      align="stretch"
      justify="start"
      style={{ minHeight: '95vh' }}
      fill
    >
      <Grid
        fill
        areas={[
          { name: 'wedge', start: [0, 0], end: [1, 0] },
          // { name: 'nav', start: [1, 0], end: [2, 0] },
          { name: 'side', start: [0, 1], end: [1, 1] },
          { name: 'main', start: [1, 0], end: [2, 1] },
          { name: 'foot', start: [0, 2], end: [2, 2] }
        ]}
        columns={['small', 'flex']}
        rows={['xxsmall', 'large', 'xsmall']}
        gap="small"
      >
        <Box gridArea="wedge" pad={{ left: 'medium' }}>
          <Select
            options={['pages']}
            placeholder="Collections"
            value={collection}
            onChange={({ option }) => {
              setSelectedDocID(undefined)
              setCollection(option)
            }}
          />
        </Box>
        {/* <Box gridArea="nav"></Box> */}
        <Box gridArea="side">
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
            </>
          )}
        </Box>
        <Box gridArea="main" pad={{ horizontal: 'medium', bottom: 'small' }}>
          {selectedPage && (
            <>
              <Box
                direction="row"
                align="center"
                justify="center"
                pad={{ left: 'small', vertical: 'xsmall' }}
                round="small"
                border={{
                  side: 'all',
                  color: 'border'
                }}
              >
                <Text style={{ lineHeight: '19px' }}>
                  {window.location.origin}
                </Text>
                <TextInput
                  value={selectedPage._id}
                  onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
                    setSelectedPage({
                      ...selectedPage,
                      _id: event.target.value
                    })
                  }
                  style={{
                    border: 'none',
                    paddingLeft: 0,
                    width: '99.5%'
                  }}
                />
              </Box>

              <TextArea
                fill
                placeholder="content"
                value={selectedPage.content}
                onChange={(event: React.ChangeEvent<HTMLTextAreaElement>) =>
                  setSelectedPage({
                    ...selectedPage,
                    content: event.target.value
                  })
                }
                style={{
                  border: 'none',
                  marginTop: '10px'
                }}
              />
            </>
          )}
        </Box>
        <Box
          gridArea="foot"
          pad={{ horizontal: 'medium', bottom: 'medium' }}
          align="end"
          justify="center"
          direction="column"
        >
          {selectedPage && (
            <Button label={saveMessage} onClick={() => setDoSave(true)} />
          )}
          <Text color="status-error">
            {putDocResult.status === 'error' && putDocResult.error}
          </Text>
        </Box>
      </Grid>
    </Box>
  )
}
