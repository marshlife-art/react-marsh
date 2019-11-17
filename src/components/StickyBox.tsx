import styled from 'styled-components'
import { Box } from 'grommet'
import { base } from 'grommet/themes'

const StickyBox = styled(Box)<{ top?: string }>`
  position: sticky;
  top: ${props => props.top || 0};
  background: ${base.global && base.global.colors
    ? base.global.colors.white
    : 'white'};
  z-index: 1;
`

export { StickyBox }
