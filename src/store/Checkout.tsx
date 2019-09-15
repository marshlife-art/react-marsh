import React, { useState, useEffect } from 'react'
import { Tabs, Tab, Box, Heading, Text, Button } from 'grommet'
import styled from 'styled-components'

import CheckoutInformationForm from '../components/CheckoutInformationForm'
import { useCartDocService } from '../services/useCartService'
import { useOrderService } from '../services/useOrderService'
import { PartialOrderDoc } from '../types/Order'
import Loading from '../components/Loading'

// this is kindof ugly :/
const StyledTabs = styled(Tabs)`
  div[class^='StyledTabs__StyledTabsHeader'] {
    justify-content: space-between;
  }
`

function Checkout() {
  const cartDocs = useCartDocService()

  const [order, setOrder] = useState<PartialOrderDoc>()
  const [doSave, setDoSave] = useState(false)
  const [loading, setLoading] = useState(false)
  const [submitFailText, setSubmitFailText] = useState('')
  const [complete, setComplete] = useState(false)
  const orderDoc = useOrderService(order, doSave, (rev: string) => {
    console.log('update rev:', rev)
    setComplete(true)
  })

  const STEPS = 3
  const [index, setIndex] = useState(0)

  const onActive = (nextIndex: number) => setIndex(nextIndex)
  const next = () => setIndex(index + 1 < STEPS ? index + 1 : 2)

  useEffect(() => {
    if (!order || orderDoc.status !== 'loaded' || !orderDoc.payload) {
      return
    }
    setOrder(orderDoc.payload)
  }, [order, orderDoc])

  useEffect(() => {
    if (cartDocs && cartDocs.status === 'loaded') {
      const line_items = cartDocs.payload.line_items
      setOrder(prevOrder => ({ ...prevOrder, line_items }))
    }
  }, [cartDocs])

  useEffect(() => {
    doSave && setDoSave(false)
  }, [doSave])

  function submitOrder() {
    console.log('submit order! order:', order)
    setLoading(true)
    // setDoSave(true)

    // setSubmitFailText
    const url = 'http://localhost:8090/order'
    setSubmitFailText('')
    fetch(url, {
      method: 'POST', // or 'PUT'
      body: JSON.stringify({ order: order }),
      headers: {
        'Content-Type': 'application/json'
      }
    })
      .then(res => res.json())
      .then(response => {
        console.log('Success:', JSON.stringify(response))
        if (response['ok']) {
          setComplete(true)
        } else {
          setSubmitFailText('onoz! not ok...')
        }
      })
      .catch(error => {
        console.error('Error:', error)
        setSubmitFailText('onoz!')
      })
      .finally(() => setLoading(false))
  }

  return (
    <Box fill align="center">
      <Box width="medium">
        <Heading level={3}>Checkout</Heading>

        <StyledTabs activeIndex={index} onActive={onActive}>
          <Tab title="Information">
            <Box margin={{ top: 'medium' }}>
              <CheckoutInformationForm
                next={next}
                order={order}
                setOrder={setOrder}
              />
            </Box>
          </Tab>
          <Tab title="Payment">
            <Box margin={{ top: 'medium' }} pad={{ horizontal: 'small' }}>
              pay pay pay
              <Box
                direction="row"
                justify="between"
                margin={{ top: 'medium', bottom: 'xlarge' }}
              >
                <Text></Text>

                <Button
                  type="submit"
                  label="Continue"
                  primary
                  onClick={() => next()}
                  hoverIndicator
                />
              </Box>
            </Box>
          </Tab>
          <Tab title="Confirm">
            <Box margin={{ top: 'medium' }} pad={{ horizontal: 'small' }}>
              {!complete && (
                <>
                  <Text>confirm confirm confirm</Text>
                  {cartDocs.status === 'loaded' && cartDocs.payload.line_items && (
                    <Box direction="column" pad={{ right: 'medium' }}>
                      <Text>Total</Text>
                      <Text size="xlarge" weight="bold">
                        $
                        {cartDocs.payload.line_items
                          .reduce(
                            (accumulator, currentValue) =>
                              accumulator + currentValue.price,
                            0
                          )
                          .toFixed(2)}
                      </Text>
                    </Box>
                  )}
                  <Box
                    direction="row"
                    justify="between"
                    margin={{ top: 'medium', bottom: 'xlarge' }}
                  >
                    <Text></Text>

                    <Button
                      label="Submit Order"
                      disabled={loading}
                      onClick={() => submitOrder()}
                      primary
                      hoverIndicator
                    />
                  </Box>
                </>
              )}
              {loading && <Loading />}
              {submitFailText && (
                <Text color="status-critical">{submitFailText}</Text>
              )}
              {complete && (
                <Box align="center">
                  <Heading level={1}>
                    <span role="img" aria-label="cat smile">
                      😸
                    </span>
                  </Heading>
                  <Heading level={3}>Thank you!</Heading>
                </Box>
              )}
            </Box>
          </Tab>
        </StyledTabs>
      </Box>
    </Box>
  )
}

export default Checkout
