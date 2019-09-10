import React from 'react'
import { Box } from 'grommet'

import { Service } from '../../types/Service'
import { Page } from '../../types/Page'
// import { OrderDoc } from '../../types/Order'

interface OrderEditorProps {
  doc: Service<Page>
}

function OrderEditor(props: OrderEditorProps) {
  return (
    <Box pad={{ horizontal: 'medium', bottom: 'small' }} fill>
      <pre>{JSON.stringify(props.doc, null, 2)}</pre>
    </Box>
  )
}

export default OrderEditor
