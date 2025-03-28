"use server"

import { DeleteActionResponse, ReceiptActionResponse, ReceiptsActionResponse } from "@/app/types"
import { PrismaClient } from "@prisma/client"
import { revalidatePath } from "next/cache"
// import { Receipt, ReceiptActionResponse, ReceiptsActionResponse, DeleteActionResponse } from "@/types/receipt"

const prisma = new PrismaClient()

// Create a new receipt
export async function createReceipt(formData: FormData): Promise<ReceiptActionResponse> {
  const data = {
    receiptNumber: formData.get("receiptNumber") as string,
    customerName: formData.get("customerName") as string,
    customerEmail: formData.get("customerEmail") as string || null,
    customerPhone: formData.get("customerPhone") as string || null,
    date: new Date(formData.get("date") as string),
    totalAmount: parseFloat(formData.get("totalAmount") as string),
    amountPaid: parseFloat(formData.get("amountPaid") as string),
    paymentMethod: formData.get("paymentMethod") as string || null,
    paymentFor: formData.get("paymentFor") as string,
    notes: formData.get("notes") as string || null,
    currency: formData.get("currency") as string,
  }

  try {
    const receipt = await prisma.receipt.create({ data })
    revalidatePath("/dashboard")
    return { success: true, id: receipt.id }
  } catch (error) {
    return { success: false, error: "Failed to create receipt" }
  }
}

// Get all receipts
export async function getReceipts(): Promise<ReceiptsActionResponse> {
  try {
    const receipts = await prisma.receipt.findMany({
      orderBy: { createdAt: "desc" }
    })
    return { success: true, data: receipts }
  } catch (error) {
    return { success: false, error: "Failed to fetch receipts" }
  }
}

// Get a single receipt by ID
export async function getReceiptById(id: string): Promise<ReceiptActionResponse> {
  try {
    const receipt = await prisma.receipt.findUnique({
      where: { id }
    })
    
    if (!receipt) {
      return { success: false, error: "Receipt not found" }
    }
    
    return { success: true, data: receipt }
  } catch (error) {
    return { success: false, error: "Failed to fetch receipt" }
  }
}

// Delete a receipt
export async function deleteReceipt(id: string): Promise<DeleteActionResponse> {
  try {
    await prisma.receipt.delete({
      where: { id }
    })
    revalidatePath("/dashboard")
    return { success: true }
  } catch (error) {
    return { success: false, error: "Failed to delete receipt" }
  }
}