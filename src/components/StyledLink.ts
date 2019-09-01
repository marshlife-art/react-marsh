import styled from 'styled-components'
import { Link } from 'react-router-dom'
import { base } from 'grommet/themes'

import { Colors } from '../types/GrommetColors'

export const StyledLink = styled(Link)`
  text-decoration: none;
  color: ${(props: { color: Colors }) => base.global.colors[props.color]};
  &:hover {
    text-decoration: underline;
  }
`
