
export interface Purchase {
  id?: number
  supplierId: number
  date: number
  notes: string
  details?: [PurchaseDetails]
}

export interface PurchaseDetails {
  id?: number
  purchaseInvoiceId: number
  productId: number
  quantity: number
  price: number
  paidPrice: number
}
