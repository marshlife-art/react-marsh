interface LineItem {
  quantity: number
  price: number
  data?: string[]
}
export interface CartDoc {
  _id: string
  _rev?: string
  line_items?: LineItem[]
}
