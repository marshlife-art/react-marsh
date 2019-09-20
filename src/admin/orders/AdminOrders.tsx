import React, { useState, useEffect } from 'react'
import {
  Box,
  DataTable,
  Text,
  CheckBox,
  Table,
  TableHeader,
  TableRow,
  TableCell,
  TableBody
} from 'grommet'
import { base } from 'grommet/themes'
import styled from 'styled-components'

import { PlainSidebarButton } from '../../components/SidebarButton'
import { useAllDocumentsService } from '../../services/usePageService'
import { OrderDoc } from '../../types/Order'
import { tryGetDateTime } from '../../util/utilz'
import { Switch, Route } from 'react-router'
// import { Dashboard } from 'grommet-icons'
// import { AdminPages } from '../AdminPages'
// import { AdminProducts } from '../products/AdminProducts'
import EditOrder, { ShowOrder } from './EditOrder'

type OrderAction = 'show' | 'item_report' | undefined

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

function ItemReport(props: { orders: OrderDoc[] }) {
  return (
    <Table caption="items">
      <TableHeader>
        <TableRow>
          {props.orders[0] &&
            props.orders[0].line_items[0] &&
            props.orders[0].line_items[0].data &&
            props.orders[0].line_items[0].data.map((_, i) => (
              <TableCell key={`header${i}`} scope="col">
                <Text>{i === 0 && 'I T E M S'}</Text>
              </TableCell>
            ))}
        </TableRow>
      </TableHeader>
      <TableBody>
        {props.orders.map(order =>
          order.line_items.map((li, i) => (
            <TableRow key={`li${i}`}>
              {li.data &&
                li.data.map((item, idx) => (
                  <TableCell key={`cell${i}${idx}`}>{item}</TableCell>
                ))}
            </TableRow>
          ))
        )}
      </TableBody>
    </Table>
  )
}

function Orders(props: {
  checked: string[]
  setChecked: (value: string[]) => void
  orderAction: OrderAction
  setOrderAction: (value: OrderAction) => void
}) {
  const { checked, setChecked, orderAction } = props
  const [orders, setOrders] = useState<OrderDoc[]>([])
  const allDocs = useAllDocumentsService('orders', true, true)

  const onCheck = (
    event: React.ChangeEvent<HTMLInputElement>,
    value: string
  ) => {
    if (event.target.checked) {
      setChecked([...checked, value])
    } else {
      setChecked(checked.filter(item => item !== value))
    }
  }

  const onCheckAll = (event: React.ChangeEvent<HTMLInputElement>) =>
    setChecked(
      event.target.checked ? orders.map((datum: OrderDoc) => datum._id) : []
    )

  useEffect(() => {
    if (allDocs.status === 'loaded') {
      const orderz = allDocs.payload.rows.map(row => row.doc)

      setOrders(orderz)
    }
  }, [allDocs])

  const checkColz = [
    {
      property: 'checkbox',
      render: (datum: OrderDoc) => (
        <CheckBox
          key={`check${datum._id}`}
          checked={checked.indexOf(datum._id) !== -1}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            onCheck(e, datum._id)
          }
        />
      ),
      header: (
        <CheckBox
          checked={orders.length > 0 && checked.length === orders.length}
          indeterminate={checked.length > 0 && checked.length < orders.length}
          onChange={onCheckAll}
        />
      ),
      sortable: false
    },
    ...COLUMNS
  ]

  return (
    <Box style={{ maxHeight: '100vh' }} overflow="scroll">
      {orderAction &&
        orderAction === 'show' &&
        checked.map(id => <ShowOrder key={`showorder${id}`} id={id} />)}
      {orderAction && orderAction === 'item_report' && (
        <ItemReport orders={orders} />
      )}
      <StyledDataTable
        columns={checkColz}
        data={orders}
        // onClickRow={(event: any) =>
        //   console.log('FUCK IS THIS RELEASED YET?! onClick event.datum:', event)
        // }
        sortable
        resizeable
        style={{ display: orderAction === undefined ? 'initial' : 'none' }}
      />
    </Box>
  )
}

function AdminOrders() {
  const [checked, setChecked] = useState<string[]>([])
  const [orderAction, setOrderAction] = useState<OrderAction>()

  return (
    <>
      <Box gridArea="side" fill>
        {/* <SidebarButton label="orders" to="/admin/orders" useActive /> */}
        <PlainSidebarButton
          label="orders"
          onClick={() => setOrderAction(undefined)}
          active={orderAction === undefined}
        />
        {checked && checked.length > 0 && (
          <>
            <PlainSidebarButton
              label="show orders"
              onClick={() => setOrderAction('show')}
              active={orderAction === 'show'}
            />
            <PlainSidebarButton
              label="item report"
              onClick={() => setOrderAction('item_report')}
              active={orderAction === 'item_report'}
            />
          </>
        )}
      </Box>

      <Box gridArea="main" fill justify="start" align="start">
        <Switch>
          <Route exact path="/admin/orders/edit/:id" component={EditOrder} />
          <Route
            path="/admin/orders"
            render={() => (
              <Orders
                checked={checked}
                setChecked={setChecked}
                orderAction={orderAction}
                setOrderAction={setOrderAction}
              />
            )}
          />
        </Switch>
      </Box>
    </>
  )
}

export { AdminOrders }
