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
}

export type ProductMapPartial = Partial<ProductMap>

export type ProductPropMapFn = (row: string[]) => string[]

export type ProductMapFn = (key: keyof ProductMap, row: string[]) => string

export interface ProductDoc {
  _id: string
  _rev?: string
  data?: string[][]
  product_map?: ProductMap
}
