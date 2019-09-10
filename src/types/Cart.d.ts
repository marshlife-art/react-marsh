export type UnitType = 'CS' | 'EA'

export interface LineItem {
  unit_type: UnitType
  quantity: number
  price: number
  data?: string[]
}

export interface CartDoc {
  _id: string
  _rev?: string
  line_items?: LineItem[]
}
