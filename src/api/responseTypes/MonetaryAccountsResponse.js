/* @flow */
import type { MonetaryAccountResponse } from './MonetaryAccountResponse'
import type { Pagination } from './Pagination'

export type MonetaryAccountsResponse = {
  Response: Array<MonetaryAccountResponse>,
  Pagination: Pagination
}
