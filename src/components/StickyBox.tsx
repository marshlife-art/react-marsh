import styled from 'styled-components'
import { Box } from 'grommet'
import { base } from 'grommet/themes'

const StickyBox = styled(Box)<{ top?: string }>`
  position: sticky;
  top: 0;
  top: ${props => props.top || 0};
  background: ${base.global.colors.white};
  z-index: 1;
`

export { StickyBox }
