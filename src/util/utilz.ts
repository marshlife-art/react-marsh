import { ProductMapFn, ProductPropMapFn, ProductKey } from '../types/Product'

// #TODO: dynamically get this from relevant PouchDB data
const PRODUCTMAP = {
  name: [0],
  description: [1],
  pk: [2],
  size: [3],
  unit_type: [4],
  price: [5],
  unit_price: [6],
  property: [7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22]
}

export const productPropMapFn: ProductPropMapFn = (row: string[]): string[] =>
  PRODUCTMAP['property'].map((idx: number) => row[idx])

export const productMap: ProductMapFn = (
  key: ProductKey,
  row: string[]
): string => PRODUCTMAP[key].map((idx: number) => row[idx]).join(' ')
