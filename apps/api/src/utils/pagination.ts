export type PaginationModel = {
  limit: number
  offset: number
}
export type PaginationWithTotal = { total: number } & PaginationModel
