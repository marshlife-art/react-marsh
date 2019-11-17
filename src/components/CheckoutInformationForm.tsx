import React, { useState, useEffect } from 'react'
import {
  Box,
  Text,
  Button,
  Form,
  FormField,
  MaskedInput,
  TextArea
} from 'grommet'

import { PartialOrderDoc } from '../types/Order'

interface CheckoutInformationFromProps {
  next: () => void
  order: PartialOrderDoc | undefined
  setOrder: (
    prevOrder: (value: PartialOrderDoc | undefined) => PartialOrderDoc
  ) => void
}

function CheckoutInformationForm(props: CheckoutInformationFromProps) {
  const [name, setName] = useState<string | undefined>('')
  const [email, setEmail] = useState<string | undefined>('')
  const [phone, setPhone] = useState<string>('')
  const [address, setAddress] = useState<string | undefined>()
  const [notes, setNotes] = useState<string | undefined>()

  const { order } = props
  useEffect(() => {
    if (order) {
      order.name && setName(order.name)
      order.email && setEmail(order.email)
      order.phone && order.phone && setPhone(order.phone)
      order.address && setAddress(order.address)
      order.notes && setNotes(encodeURIComponent(order.notes)) // oh stringz :/
    }
  }, [order])

  function onSubmit(event: React.FormEvent<Element>) {
    const { setOrder, next } = props
    // setOrder( (prevOrder:PartialOrderDoc) => ({ ...prevOrder, name, email, phone, address, notes }) )
    setOrder(prevOrder => ({
      ...prevOrder,
      name,
      email,
      phone,
      address,
      notes
    }))
    next()
  }

  return (
    <Form onSubmit={onSubmit}>
      <FormField
        label="Name"
        name="name"
        value={name}
        onChange={e => setName(e.target.value)}
        required
      />
      <FormField
        label="Email"
        name="email"
        type="email"
        value={email}
        onChange={e => setEmail(e.target.value)}
        required
      />
      <FormField label="Phone" htmlFor="phone">
        <MaskedInput
          name="phone"
          id="phone"
          value={phone}
          onChange={e => setPhone(e.target.value)}
          mask={[
            { fixed: '(' },
            {
              length: 3,
              regexp: /^[0-9]{1,3}$/,
              placeholder: 'xxx'
            },
            { fixed: ')' },
            { fixed: ' ' },
            {
              length: 3,
              regexp: /^[0-9]{1,3}$/,
              placeholder: 'xxx'
            },
            { fixed: '-' },
            {
              length: 4,
              regexp: /^[0-9]{1,4}$/,
              placeholder: 'xxxx'
            }
          ]}
          required
        />
      </FormField>

      <FormField
        label="Address"
        name="address"
        component={TextArea}
        value={address}
        onChange={e => setAddress(e.target.value)}
      />
      <FormField
        label="Notes"
        name="notes"
        component={TextArea}
        value={notes}
        onChange={e => setNotes(encodeURIComponent(e.target.value))}
      />
      {/* <FormField
    name="subscribe"
    component={CheckBox}
    pad
    label="Subscribe?"
  /> */}

      <Box
        direction="row"
        justify="between"
        margin={{ top: 'medium', bottom: 'xlarge' }}
      >
        <Text></Text>

        <Button type="submit" label="Continue" primary hoverIndicator />
      </Box>
    </Form>
  )
}

export default CheckoutInformationForm
