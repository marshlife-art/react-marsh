import React from 'react'
// import { ThunkDispatch } from 'redux-thunk'
// import { connect } from 'react-redux'
import styled from 'styled-components'
import { Box } from 'grommet'

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

  return (
    <Box
      gridArea="sidebar"
      width="small"
      animation={[
        { type: 'fadeIn', duration: 300 },
        { type: 'slideLeft', size: 'xlarge', duration: 150 }
      ]}
    >
      <Box pad={{ horizontal: 'medium', vertical: 'small' }}>CART</Box>
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
