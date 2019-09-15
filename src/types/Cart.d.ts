import { ProductMap } from './Product'

export type UnitType = 'CS' | 'EA'

export interface LineItem {
  unit_type: UnitType
  quantity: number
  price: number
  data?: string[]
  product_map?: ProductMap
}

export interface CartDoc {
  _id: string
  _rev?: string
  line_items?: LineItem[]
}
