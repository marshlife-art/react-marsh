export interface Product {
  unf: string
  upc_code: string
  category: string
  sub_category: string
  name: string
  description: string
  pk: number
  size: string
  unit_type: string
  ws_price: number
  u_price: number
  codes: string
}

// #TODO: yank this pouch-related stuff
export interface ProductMap {
  name: number[]
  description: number[]
  pk: number[]
  size: number[]
  unit_type: number[]
  price: number[]
  unit_price: number[]
  property: number[]
  category: number[]
  search: number[]
}

export type ProductMapPartial = Partial<ProductMap>

export interface ProductMeta {
  data_length: number
  catz: { name: string; count: number }[]
  date_added: number // Date
  header: string[]
}

export type ProductPropMapFn = (
  row: string[],
  productMap?: ProductMap
) => string[]

export type ProductMapFn = (
  key: keyof ProductMap,
  row: string[],
  productMap?: ProductMap
) => string

export interface ProductDoc {
  _id: string
  _rev?: string
  data?: string[][]
  product_map?: ProductMap
  meta?: ProductMeta
}
