import { LineItem } from './Cart'

export type PaymentStatus =
  | 'balance_due'
  | 'credit_owed'
  | 'failed'
  | 'paid'
  | 'void'
export type ShipmentStatus =
  | 'backorder'
  | 'canceled'
  | 'partial'
  | 'pending'
  | 'ready'
  | 'shipped'

export interface OrderDoc {
  _id: string
  _rev?: string
  payment_status: PaymentStatus
  shipment_status: ShipmentStatus
  line_items: LineItem[]
  total: number
  name: string
  email: string
  phone: string
  address?: string
  notes?: string
}

export type PartialOrderDoc = Partial<OrderDoc>
