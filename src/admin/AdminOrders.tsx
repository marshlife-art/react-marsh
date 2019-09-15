import React, { useState, useEffect } from 'react'
import { Box, DataTable, Text } from 'grommet'
import { base } from 'grommet/themes'
import styled from 'styled-components'

import SidebarButton from '../components/SidebarButton'
import { useAllDocumentsService } from '../services/usePageService'
import { OrderDoc } from '../types/Order'
import { tryGetDateTime } from '../util/utilz'

// this, also, is p ugly :/
const StyledDataTable = styled(DataTable)`
  tr div[class^='StyledTextInput__StyledTextInputContainer'] {
    min-width: 175px;
    max-width: 300px;
    position: absolute;
    top: 5px;
    z-index: 3;
    background: ${base.global.colors.white};
  }
`

// #TODO: typingz would be nice here...
const COLUMNS = [
  {
    property: '_id',
    header: <Text>Created</Text>,
    primary: true,
    render: (order: OrderDoc) => <Text>{tryGetDateTime(order._id)}</Text>
  },
  {
    property: 'status',
    header: <Text>Status</Text>,
    search: true
  },
  {
    property: 'payment_status',
    header: <Text>Payment Status</Text>,
    search: true
  },
  {
    property: 'shipment_status',
    header: <Text>Shipment Status</Text>,
    search: true
  },
  {
    property: 'name',
    header: <Text>Name</Text>,
    search: true
  },
  {
    property: 'email',
    header: <Text>Email</Text>,
    search: true
  },
  {
    property: 'phone',
    header: <Text>Phone</Text>,
    search: true
  },
  {
    property: 'address',
    header: <Text>Address</Text>,
    search: true
  },
  {
    property: 'notes',
    header: <Text>Notes</Text>,
    search: true,
    render: (order: OrderDoc) => (
      <Text>{order.notes ? decodeURIComponent(order.notes) : ''}</Text>
    )
  },
  {
    property: 'line_items',
    header: 'Items',
    render: (order: OrderDoc) => <Text>{order.line_items.length}</Text>
  }
]

function Orders() {
  const [orders, setOrders] = useState()
  const allDocs = useAllDocumentsService('orders', true, true)

  useEffect(() => {
    if (allDocs.status === 'loaded') {
      const orderz = allDocs.payload.rows.map(row => row.doc)

      setOrders(orderz)
    }
  }, [allDocs])
  //
  return (
    <Box style={{ maxHeight: '100vh' }} overflow="scroll">
      <StyledDataTable
        columns={COLUMNS}
        data={orders}
        // onClickRow={(event: any) =>
        //   console.log('FUCK IS THIS RELEASED YET?! onClick event.datum:', event)
        // }
        sortable
        resizeable
      />
    </Box>
  )
}

function AdminOrders() {
  return (
    <>
      <Box gridArea="side" fill>
        <SidebarButton label="orders" to="/admin/orders" useActive />
      </Box>

      <Box gridArea="main" fill justify="start" align="start">
        <Orders />
      </Box>
    </>
  )
}

export { AdminOrders }
