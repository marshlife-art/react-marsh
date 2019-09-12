import React, { createRef, Component } from 'react'

import { Search } from 'grommet-icons'
import { Box, Image, Text, TextInput } from 'grommet'

interface Folks {
  name: string
  imageUrl: string
}
const folks: Folks[] = [
  {
    name: 'Alan Souza',
    imageUrl:
      'https://s.gravatar.com/avatar/b226da5c619b18b44eb95c30be393953?s=80'
  },
  {
    name: 'Bryan Jacquot',
    imageUrl:
      'https://s.gravatar.com/avatar/10d15019166606cfed23846a7f902660?s=80'
  },
  {
    name: 'Chris Carlozzi',
    imageUrl:
      'https://s.gravatar.com/avatar/56ea1e2ecd0d3cc85479b2d09e31d071?s=80'
  },
  {
    name: 'Eric Soderberg',
    imageUrl:
      'https://s.gravatar.com/avatar/99020cae7ff399a4fbea19c0634f77c3?s=80'
  },
  {
    name: 'Marlon Parizzotto',
    imageUrl:
      'https://s.gravatar.com/avatar/e6684969375a4dcc0aa99f0bfae544c3?s=80'
  },
  {
    name: 'Tales Chaves',
    imageUrl:
      'https://s.gravatar.com/avatar/1f80adca55d9f5d97932ff97f631a4e8?s=80'
  },
  {
    name: 'Tracy Barmore',
    imageUrl:
      'https://s.gravatar.com/avatar/4ec9c3a91da89f278e4482811caad7f3?s=80'
  }
]

interface SearchInputState {
  value: string
  suggestionOpen: boolean
  suggestedFolks: Folks[]
}

export class SearchInput extends Component<{}, SearchInputState> {
  state: SearchInputState = {
    value: '',
    suggestionOpen: false,
    suggestedFolks: []
  }

  boxRef = createRef<HTMLDivElement>()

  componentDidMount() {
    this.forceUpdate()
  }

  onChange = (event: React.ChangeEvent<HTMLInputElement>) =>
    this.setState({ value: event.target.value }, () => {
      const { value } = this.state
      if (!value.trim()) {
        this.setState({ suggestedFolks: [] })
      } else {
        // simulate an async call to the backend
        setTimeout(() => this.setState({ suggestedFolks: folks }), 300)
      }
    })

  onSelect = (event: { target: HTMLElement | null; suggestion: any }) =>
    this.setState({ value: event.suggestion.value })

  renderSuggestions = () => {
    const { value, suggestedFolks } = this.state

    return suggestedFolks
      .filter(
        ({ name }) => name.toLowerCase().indexOf(value.toLowerCase()) >= 0
      )
      .map(({ name, imageUrl }, index, list) => ({
        label: (
          <Box
            direction="row"
            align="center"
            gap="small"
            border={index < list.length - 1 ? 'bottom' : undefined}
            pad="small"
          >
            <Image
              width="48px"
              src={imageUrl}
              style={{ borderRadius: '100%' }}
            />
            <Text>
              <strong>{name}</strong>
            </Text>
          </Box>
        ),
        value: name
      }))
  }

  render() {
    const { suggestionOpen, value } = this.state

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
          // ref={this.boxRef}
          width="large"
          direction="row"
          align="center"
          pad={{ horizontal: 'small' }}
          round="small"
          elevation={suggestionOpen ? 'medium' : undefined}
          border={{
            side: 'all',
            color: suggestionOpen ? 'transparent' : 'border'
          }}
          style={
            suggestionOpen
              ? {
                  borderLeft: 'none',
                  borderTopLeftRadius: '0px',
                  borderBottomLeftRadius: '0px',
                  borderBottomRightRadius: '0px'
                }
              : {
                  borderLeft: 'none',
                  borderTopLeftRadius: '0px',
                  borderBottomLeftRadius: '0px'
                }
          }
        >
          <Search color="brand" />
          <TextInput
            type="search"
            // dropTarget={this.boxRef.current}
            plain
            value={value}
            onChange={this.onChange}
            onSelect={this.onSelect}
            suggestions={this.renderSuggestions()}
            placeholder="Search..."
            onSuggestionsOpen={() => this.setState({ suggestionOpen: true })}
            onSuggestionsClose={() => this.setState({ suggestionOpen: false })}
          />
        </Box>
      </Box>
    )
  }
}
