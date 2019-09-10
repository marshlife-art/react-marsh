export type ProductKey =
  | 'name'
  | 'description'
  | 'pk'
  | 'size'
  | 'unit_type'
  | 'price'
  | 'unit_price'
  | 'property'

export type ProductPropMapFn = (row: string[]) => string[]

export type ProductMapFn = (key: ProductKey, row: string[]) => string

export interface ProductDoc {
  _id: string
  _rev?: string
  data?: string[][]
}
