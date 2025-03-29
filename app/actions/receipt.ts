"use server"

import type { ReceiptActionResponse, ReceiptsActionResponse, DeleteActionResponse } from "@/app/types"
import { db } from "@/prisma/db"
import { revalidatePath } from "next/cache"

// Define the type for receipt creation input
type CreateReceiptInput = {
  customerName: string
  customerEmail: string | null
  customerPhone: string | null
  receiptNumber: string
  date: Date
  totalAmount: number
  amountPaid: number
  paymentMethod: string | null
  paymentFor: string
  notes: string | null
  currency: string
}

// Create a new receipt
export async function createReceipt(data: CreateReceiptInput): Promise<ReceiptActionResponse> {
  try {
    const createdReceipt = await db.receipt.create({
      data: {
        ...data,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    })
    revalidatePath("/dashboard")
    revalidatePath(`/receipt/${createdReceipt.id}`)
    return { success: true, id: createdReceipt.id }
  } catch (error) {
    console.error("Error creating receipt:", error)
    return { success: false, error: "Failed to create receipt" }
  }
}

// Get all receipts
export async function fetchReceipts(): Promise<ReceiptsActionResponse> {
  try {
    const receipts = await db.receipt.findMany({
      orderBy: {
        createdAt: "desc",
      },
    })
    return { success: true, data: receipts }
  } catch (error) {
    console.error("Error fetching receipts:", error)
    return { success: false, error: "Failed to fetch receipts" }
  }
}

// Get a single receipt by ID
export async function fetchReceiptById(id: string): Promise<ReceiptActionResponse> {
  try {
    const receipt = await db.receipt.findUnique({
      where: { id },
    })

    if (!receipt) {
      return { success: false, error: "Receipt not found" }
    }

    return { success: true, data: receipt }
  } catch (error) {
    console.error("Error fetching receipt:", error)
    return { success: false, error: "Failed to fetch receipt" }
  }
}

// Delete a receipt
export async function deleteReceipt(id: string): Promise<DeleteActionResponse> {
  try {
    await db.receipt.delete({
      where: { id },
    })
    revalidatePath("/dashboard")
    return { success: true }
  } catch (error) {
    console.error("Error deleting receipt:", error)
    return { success: false, error: "Failed to delete receipt" }
  }
}

