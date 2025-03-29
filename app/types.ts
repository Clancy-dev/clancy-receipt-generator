import type { Receipt } from "@prisma/client"

export type ReceiptActionResponse = {
  success: boolean
  data?: Receipt
  error?: string
  id?: string
}

export type ReceiptsActionResponse = {
  success: boolean
  data?: Receipt[]
  error?: string
}

export type DeleteActionResponse = {
  success: boolean
  error?: string
}

