import React, { useState, useRef } from 'react'
import { Box, Text, Drop } from 'grommet'

const PROPERTY_MAP: { [index: string]: string } = {
  a: 'Artificial ingredients',
  c: 'Low carb',
  d: 'Dairy free',
  f: 'Food Service items',
  g: 'Gluten free',
  k: 'Kosher',
  l: 'Low sodium/no salt',
  m: 'Non-GMO Project Verified ',
  og: 'Organic',
  r: 'Refined sugar',
  v: 'Vegan',
  w: 'Yeast free',
  ft: 'Fair Trade',
  n: 'Natural',
  s: 'Specialty Only',
  y: 'Yeast free',
  1: '100% organic',
  2: '95+% organic',
  3: '70%+ organic'
}

function ProductProperty(props: { property: string }) {
  const [open, setOpen] = useState(false)
  const ref = useRef()

  return (
    <>
      <Box
        round
        background="accent-3"
        pad={{ horizontal: 'xsmall', vertical: 'xxsmall' }}
        ref={ref as any}
        onMouseOver={() => setOpen(true)}
        onMouseOut={() => setOpen(false)}
        onFocus={() => setOpen(true)}
        onBlur={() => setOpen(false)}
      >
        <Text size="small">{props.property}</Text>
      </Box>
      {open && (
        <Drop align={{ left: 'right' }} target={ref.current} plain>
          <Box
            pad="xsmall"
            background="dark-3"
            round={{ size: 'medium', corner: 'left' }}
          >
            {PROPERTY_MAP[props.property]}
          </Box>
        </Drop>
      )}
    </>
  )
}

export { ProductProperty }
