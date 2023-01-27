
export interface Product {
  id?: number
  categoryId: number,
  name: string
  quantity: number
  unit: string
  averagePrice?: number
  salePrice: number
  notes: string
}
