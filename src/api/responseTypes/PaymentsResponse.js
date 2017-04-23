/* @flow */
import type { PaymentResponse } from './PaymentResponse'
import type { Pagination } from './Pagination'

export type PaymentsResponse = {
  Response: Array<PaymentResponse>,
  Pagination: Pagination
}
