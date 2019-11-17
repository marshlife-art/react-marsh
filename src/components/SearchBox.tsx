import React, { useState } from 'react'
import { withRouter, RouteComponentProps } from 'react-router-dom'
import { Box, TextInput, Button } from 'grommet'
import { Search, Close } from 'grommet-icons'
import { base } from 'grommet/themes'
import styled from 'styled-components'
import { StickyBox } from './StickyBox'
import queryString from 'query-string'

// todo query-params

const SearchBoxWrapper = styled(Box)`
  position: sticky;
  top: 0;
  z-index: 3;
  background: ${base.global && base.global.colors
    ? base.global.colors.white
    : 'white'};
`

function SearchInput(props: RouteComponentProps) {
  // #todo use query-paramz
  const [q, setQ] = useState(props.history.location.search.replace('?', ''))

  // queryString.parse(props.history.location.search)["q"]

  const onChange = (event: React.ChangeEvent<HTMLInputElement>) =>
    setQ(event.target.value)

  const onKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      if (q.trim().length) {
        props.history.push({ pathname: '/store/search', search: q })
        // queryString.stringify
      }
    }
  }

  // useEffect(() => {
  //   console.log('[SearchInput] effect gonna set history q:', q)
  //   // props.location.search = q
  //   props.history.push({ search: q })
  // }, [q, props.history])

  return (
    <Box
      fill
      align="center"
      animation={[
        { type: 'fadeOut', size: 'xlarge', duration: 150 },
        { type: 'fadeIn', size: 'xlarge', duration: 350 }
      ]}
    >
      <Box
        width="large"
        direction="row"
        align="center"
        pad={{ horizontal: 'small' }}
        round="small"
        border={{
          side: 'all',
          color: 'border'
        }}
        style={{
          borderLeft: 'none',
          borderTopLeftRadius: '0px',
          borderBottomLeftRadius: '0px'
        }}
      >
        <Search color="brand" />
        <TextInput
          type="search"
          plain
          value={q}
          onChange={onChange}
          onKeyDown={onKeyDown}
          placeholder="Search..."
        />
      </Box>
    </Box>
  )
}

function SearchBox(props: RouteComponentProps) {
  const [showSearch, setShowSearch] = useState(props.location.search.length > 0)

  return showSearch ? (
    <SearchBoxWrapper
      direction="row"
      margin={{ horizontal: 'medium' }}
      pad={{ vertical: 'small' }}
      style={{ width: '500px' }}
    >
      <Button
        onClick={() => setShowSearch(false)}
        icon={<Close />}
        active={showSearch}
        hoverIndicator
      />
      <SearchInput {...props} />
    </SearchBoxWrapper>
  ) : (
    <StickyBox
      top="0px"
      direction="row"
      pad={{ horizontal: 'medium', vertical: 'small' }}
      style={{ width: `${24 + 48}px` }}
    >
      <Button
        onClick={() => setShowSearch(true)}
        icon={<Search />}
        active={showSearch}
        hoverIndicator
      />
    </StickyBox>
  )
}

export default withRouter(SearchBox)

/* 
import { Close, Search } from 'grommet-icons'


  

{showSearch && <SearchInput />}
          <Button
            onClick={() => setShowSearch(!showSearch)}
            icon={showSearch ? <Close /> : <Search />}
            active={showSearch}
            hoverIndicator
          />


          */
