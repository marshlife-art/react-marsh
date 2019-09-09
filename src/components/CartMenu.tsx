import React from 'react'
// import { ThunkDispatch } from 'redux-thunk'
// import { connect } from 'react-redux'
// import styled from 'styled-components'
import { Box, Text } from 'grommet'
import { useCartDocService } from '../services/useCartService'

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

const CartMenu = () => {
  // const [open, setOpen] = useState(false)

  const cartDocs = useCartDocService()

  return (
    <Box
      gridArea="sidebar"
      width="small"
      animation={[
        { type: 'fadeIn', duration: 300 },
        { type: 'slideLeft', size: 'xlarge', duration: 150 }
      ]}
    >
      <Box
        pad={{ horizontal: 'medium', vertical: 'small' }}
        border={{
          side: 'right',
          color: 'border',
          size: 'large'
        }}
      >
        {cartDocs.status === 'loaded' &&
          cartDocs.payload.data &&
          cartDocs.payload.data.map((row: string[], idx: number) => (
            <Box
              direction="column"
              pad={{ vertical: 'small' }}
              key={`cart${idx}`}
            >
              <Text size="large" title="brand name">
                {row[0]}
              </Text>
              <Text size="xlarge" title="description">
                {row[1]}
              </Text>
              <Box
                direction="row"
                gap="small"
                align="center"
                margin={{ top: 'xsmall' }}
              >
                <Text size="medium" title="package count">
                  {row[2]}ct.
                </Text>
                {row.slice(7, 22).map(r => {
                  if (!r || /^\s*$/.test(r)) {
                    // avoid blank stringz
                    return null
                  } else {
                    return r
                  }
                })}
              </Box>
            </Box>
          ))}
      </Box>
    </Box>
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
