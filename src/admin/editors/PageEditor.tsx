import React from 'react'
import { Box, Text, TextInput, TextArea, Button } from 'grommet'

import { Page } from '../../types/Page'
import { Service } from '../../types/Service'

interface PageEditorProps {
  setSelectedPage: (value: React.SetStateAction<Page | undefined>) => void
  selectedPage: Page
  putDocResult: Service<PouchDB.Core.Response>
  saveMessage: string
  setDoSave: (value: boolean) => void
}

function PageEditor(props: PageEditorProps) {
  const {
    setSelectedPage,
    selectedPage,
    putDocResult,
    saveMessage,
    setDoSave
  } = props
  return (
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
        <Text style={{ lineHeight: '19px' }}>{window.location.origin}</Text>
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

      <Box
        pad={{ horizontal: 'medium', bottom: 'medium' }}
        align="end"
        justify="center"
        direction="column"
      >
        <Button label={saveMessage} onClick={() => setDoSave(true)} />
        <Text color="status-error">
          {putDocResult.status === 'error' && putDocResult.error}
        </Text>
      </Box>
    </>
  )
}

export default PageEditor
