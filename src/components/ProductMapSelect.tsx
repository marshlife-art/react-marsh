import React, { Component } from 'react'
import { Select } from 'grommet'

import { PRODUCT_KEYS } from '../util/utilz'
import { ProductMap } from '../types/Product'

export interface ProductSelectOption {
  lab: string
  val: string
  dis: boolean
}

const PRODUCT_KEYS_FOR_SELECT: ProductSelectOption[] = PRODUCT_KEYS.map(
  key => ({ lab: key, val: key, dis: false })
)

interface ProductMapSelectProps {
  optz: ProductSelectOption[]
  pkey: keyof ProductMap
  setProductMapForKey: (key: keyof ProductMap, value: number[]) => void
}

interface ProductMapSelectState {
  options: ProductSelectOption[]
  value: string
  selected: number[]
}

export class ProductMapSelect extends Component<
  ProductMapSelectProps,
  ProductMapSelectState
> {
  static defaultProps = {
    optz: PRODUCT_KEYS_FOR_SELECT
  }

  state: ProductMapSelectState = {
    options: this.props.optz, // :/
    value: '',
    selected: []
  }

  render() {
    return (
      <Select
        size="medium"
        placeholder="Select"
        multiple
        closeOnChange={false}
        disabledKey="dis"
        labelKey="lab"
        valueKey="val"
        value={this.state.value}
        options={this.state.options}
        onChange={({ value }) => {
          const selected = value.map((v: ProductSelectOption) =>
            parseInt(v.val)
          )
          this.setState({ value, selected })
        }}
        onClose={() => {
          this.props.setProductMapForKey(this.props.pkey, this.state.selected)
        }}
        onSearch={text => {
          const exp = new RegExp(text, 'i')
          const optionz = this.props.optz.filter(o => exp.test(o.lab))
          this.setState({
            options: optionz.length ? optionz : this.props.optz
          })
        }}
      />
    )
  }
}
