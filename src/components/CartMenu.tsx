import React from 'react'
// import { ThunkDispatch } from 'redux-thunk'
// import { connect } from 'react-redux'
// import styled from 'styled-components'
import { Box, Text, Button, Layer, TextInput } from 'grommet'
import { useCartDocService } from '../services/useCartService'
import { FormClose, Trash } from 'grommet-icons'

// import { StyledLink } from './StyledLink'

// export const MenuLink = styled(StyledLink)`
//   &:hover {
//     text-decoration: underline;
//     background: rgba(0, 0, 0, 0.5);
//     color: white;
//   }
// `

// interface CartMenuProps {}
// interface DispatchProps {
//   logout: () => void
// }
// props: CartMenuProps & DispatchProps

const Quantity = () => {
  const [value, setValue] = React.useState(1)

  const onChange = (event: React.ChangeEvent<HTMLInputElement>) =>
    setValue(parseInt(event.target.value))

  return (
    <Box direction="column">
      <Text size="small">Quantity</Text>
      <TextInput
        type="number"
        value={value}
        onChange={onChange}
        placeholder="Quantity"
        style={{ maxWidth: '71px' }}
      />
    </Box>
  )
}

const CartMenu = (props: { onClickOutside: () => void }) => {
  // const [open, setOpen] = useState(false)

  const cartDocs = useCartDocService()

  return (
    <Layer
      full="vertical"
      position="right"
      onClickOutside={props.onClickOutside}
    >
      <Box fill style={{ minWidth: '450px' }}>
        <Box
          direction="row"
          align="center"
          as="header"
          elevation="small"
          justify="between"
        >
          <Text margin={{ left: 'small' }}>Cart</Text>
          <Button icon={<FormClose />} />
        </Box>
        <Box overflow="auto" style={{ display: 'block' }}>
          {cartDocs.status === 'loaded' &&
            cartDocs.payload.data &&
            cartDocs.payload.data.map((row: string[], idx: number) => (
              <Box
                direction="row"
                key={`cartrow${idx}`}
                border={idx === 0 ? undefined : 'top'}
                pad="small"
                justify="between"
              >
                <Box direction="column">
                  <Text size="small" title="brand name">
                    {row[0]}
                  </Text>
                  <Text size="medium" title="description">
                    {row[1]}
                  </Text>
                  <Box
                    direction="row"
                    gap="small"
                    align="center"
                    margin={{ vertical: 'xsmall' }}
                    height="24px"
                  >
                    <Text size="xsmall" title="package count">
                      {row[2]}ct.
                    </Text>
                    {row.slice(7, 22).map((r, i) => {
                      if (!r || /^\s*$/.test(r)) {
                        // avoid blank stringz
                        return null
                      } else {
                        return (
                          <Text size="xsmall" key={`prop${i}`}>
                            {r}
                          </Text>
                        )
                      }
                    })}
                  </Box>
                </Box>
                <Box justify="between" direction="row" align="center">
                  <Quantity />

                  <Button icon={<Trash />} hoverIndicator />
                </Box>
              </Box>
            ))}
        </Box>
        <Box
          as="footer"
          border={{ side: 'top' }}
          pad="small"
          justify="between"
          direction="row"
          align="center"
        >
          <Button color="status-warning" label="Empty Cart" hoverIndicator />
          <Button primary label="Checkout" hoverIndicator />
        </Box>
      </Box>
    </Layer>

    // <Box
    //   gridArea="sidebar"
    //   width="small"
    //   animation={[
    //     { type: 'fadeIn', duration: 300 },
    //     { type: 'slideLeft', size: 'xlarge', duration: 150 }
    //   ]}
    //   style={{ position: 'sticky', top: 0 }}
    // >
    //   <Box
    //     pad={{ horizontal: 'medium', vertical: 'small' }}
    //     border={{
    //       side: 'right',
    //       color: 'border',
    //       size: 'large'
    //     }}
    //   >

    //   </Box>
    // </Box>
  )
}

// const mapDispatchToProps = (
//   dispatch: ThunkDispatch<{}, {}, any>
// ): DispatchProps => {
//   return {
//     logout: () => dispatch(logout())
//   }
// }

// export default connect(
//   undefined,
//   mapDispatchToProps
// )(CartMenu)

export default CartMenu
