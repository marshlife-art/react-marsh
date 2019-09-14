import React, { useState, useEffect } from 'react'
import { Box, Text, TextInput, TextArea, Button, Markdown } from 'grommet'

import { Page } from '../../types/Page'
import { Service } from '../../types/Service'
import { Inspect } from 'grommet-icons'

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

  const [showPreview, setShowPreview] = useState(true)
  const [content, setContent] = useState(() => selectedPage.content)

  useEffect(() => setContent(selectedPage.content), [selectedPage])

  return (
    <Box fill direction="row">
      <Box pad={{ horizontal: 'medium', bottom: 'small' }} fill>
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
          <Button
            icon={<Inspect />}
            onClick={() => setShowPreview(!showPreview)}
            active={showPreview}
            title="PREVIEW"
            hoverIndicator
          />
        </Box>

        <TextArea
          fill
          placeholder="content"
          value={selectedPage.content}
          onChange={(event: React.ChangeEvent<HTMLTextAreaElement>) => {
            setSelectedPage({
              ...selectedPage,
              content: event.target.value
            })
            setContent(event.target.value)
          }}
          style={{
            border: 'none',
            marginTop: '10px'
          }}
        />

        <Box
          pad={{ horizontal: 'medium', top: 'small' }}
          align="end"
          justify="center"
          direction="column"
        >
          <Button label={saveMessage} onClick={() => setDoSave(true)} />
          <Text color="status-error">
            {putDocResult.status === 'error' && putDocResult.error}
          </Text>
        </Box>
      </Box>

      {showPreview && (
        <Box width="50%" fill overflow="scroll">
          <Markdown>{content}</Markdown>
        </Box>
      )}
    </Box>
  )
}

export default PageEditor
