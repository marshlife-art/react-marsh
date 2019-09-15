import React, { useState, useEffect } from 'react'
import { Box, Text } from 'grommet'
import { withRouter, RouteComponentProps } from 'react-router-dom'

import { useOrderDocService } from '../../services/useOrderService'
import Loading from '../../components/Loading'
import { OrderDoc } from '../../types/Order'

export function ShowOrder(props: { id: string }) {
  const [order, setOrder] = useState<OrderDoc>()
  const [loading, setLoading] = useState(true)
  const [errorText, setErrorText] = useState<string>()

  const orderDoc = useOrderDocService('orders', props.id)

  useEffect(() => {
    orderDoc.status !== 'loading' && setLoading(false)
    orderDoc.status === 'loaded' && setOrder(orderDoc.payload as OrderDoc)
    orderDoc.status === 'error' && setErrorText(JSON.stringify(orderDoc.error))
  }, [orderDoc])

  return (
    <div style={{ borderBottom: '1px solid gray', marginBottom: '1em' }}>
      {loading && <Loading />}
      {errorText && <Text color="status-critical">{errorText}</Text>}
      {order && (
        <dl>
          <dt>NAME</dt>
          <dd>{order.name}</dd>

          <dt>EMAIL</dt>
          <dd>{order.email}</dd>

          <dt>PHONE</dt>
          <dd>{order.phone}</dd>

          <dt>ADDRESS</dt>
          <dd>{order.address}</dd>

          <dt>NOTES</dt>
          <dd>{order.notes}</dd>

          <dt>LINE ITEMS</dt>
          <dd>
            <table>
              <thead>
                <tr>
                  <td>quantity</td>
                  <td>unit type</td>
                  <td>price</td>
                  <td>product</td>
                </tr>
              </thead>
              {order.line_items.map((li, i) => (
                <tbody key={`showOrderLI${i}`}>
                  <tr>
                    <td>{li.quantity}</td>
                    <td>{li.unit_type}</td>
                    <td>{li.price}</td>
                  </tr>
                  <tr>
                    <td colSpan={3}>&nbsp;</td>
                    {li.data &&
                      li.data.map((d, i) => <td key={`tddy${i}`}>{d}</td>)}
                  </tr>
                </tbody>
              ))}
            </table>
          </dd>
        </dl>
      )}
    </div>
  )
}

interface MatchParams {
  id: string
}

function EditOrder(props: RouteComponentProps<MatchParams>) {
  return <ShowOrder id={props.match.params.id} />
}

export default withRouter(EditOrder)
