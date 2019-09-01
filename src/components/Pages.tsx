import React, { useState } from 'react'
import { Box, Markdown } from 'grommet'

import usePageService from '../services/usePageService'

interface Props {
  slug: string
}

export function Pages(props: Props) {
  const [loading, setLoading] = useState(true)
  const result = usePageService(props.slug, setLoading)

  return (
    <Box pad={{ horizontal: 'medium', vertical: 'small' }}>
      {loading && 'Loading'}
      {result.status === 'loaded' && (
        <Markdown>{result.payload.content}</Markdown>
      )}
    </Box>
  )
}
