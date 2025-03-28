"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { ArrowLeft, Save } from "lucide-react"
import Link from "next/link"
import { v4 as uuidv4 } from "uuid"
import { toast } from "sonner"

export default function CreateReceipt() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    customerName: "",
    customerEmail: "",
    customerPhone: "",
    receiptNumber: `REC-${Math.floor(100000 + Math.random() * 900000)}`,
    date: new Date().toISOString().split("T")[0],
    totalAmount: "",
    amountPaid: "",
    paymentMethod: "",
    paymentFor: "",
    notes: "",
    currency: "UGX", // Changed from USD to UGX
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    // Create receipt object
    const receipt = {
      id: uuidv4(),
      ...formData,
      totalAmount: Number.parseFloat(formData.totalAmount),
      amountPaid: Number.parseFloat(formData.amountPaid),
      createdAt: new Date().toISOString(),
    }

    // Get existing receipts from localStorage or initialize empty array
    const existingReceipts = JSON.parse(localStorage.getItem("receipts") || "[]")

    // Add new receipt to array
    const updatedReceipts = [...existingReceipts, receipt]

    // Save back to localStorage
    localStorage.setItem("receipts", JSON.stringify(updatedReceipts))

    // Show success toast
    toast.success("Receipt created successfully")

    // Redirect to receipt view page
    router.push(`/receipt/${receipt.id}`)
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <Link href="/" className="inline-flex items-center mb-6 text-primary hover:underline">
        <ArrowLeft className="mr-2 h-4 w-4" /> Back to Home
      </Link>

      <Card className="max-w-3xl mx-auto">
        <CardHeader>
          <CardTitle>Create New Receipt</CardTitle>
          <CardDescription>Fill in the details to generate a receipt for your client</CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Customer Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="customerName">Customer Name *</Label>
                  <Input
                    id="customerName"
                    name="customerName"
                    value={formData.customerName}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="customerEmail">Customer Email</Label>
                  <Input
                    id="customerEmail"
                    name="customerEmail"
                    type="email"
                    value={formData.customerEmail}
                    onChange={handleChange}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="customerPhone">Customer Phone</Label>
                  <Input
                    id="customerPhone"
                    name="customerPhone"
                    value={formData.customerPhone}
                    onChange={handleChange}
                  />
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-medium">Payment Details</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="receiptNumber">Receipt Number</Label>
                  <Input
                    id="receiptNumber"
                    name="receiptNumber"
                    value={formData.receiptNumber}
                    onChange={handleChange}
                    readOnly
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="date">Date</Label>
                  <Input id="date" name="date" type="date" value={formData.date} onChange={handleChange} required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="totalAmount">Total Amount *</Label>
                  <Input
                    id="totalAmount"
                    name="totalAmount"
                    type="number"
                    min="0"
                    step="0.01"
                    value={formData.totalAmount}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="amountPaid">Amount Paid *</Label>
                  <Input
                    id="amountPaid"
                    name="amountPaid"
                    type="number"
                    min="0"
                    step="0.01"
                    value={formData.amountPaid}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="currency">Currency *</Label>
                  <select
                    id="currency"
                    name="currency"
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    value={formData.currency}
                    onChange={handleChange}
                    required
                  >
                    <option value="UGX">UGX (Uganda Shillings)</option>
                    <option value="USD">USD (US Dollars)</option>
                    <option value="EUR">EUR (Euros)</option>
                    <option value="KES">KES (Kenya Shillings)</option>
                    <option value="TZS">TZS (Tanzania Shillings)</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="paymentMethod">Payment Method</Label>
                  <Input
                    id="paymentMethod"
                    name="paymentMethod"
                    placeholder="e.g. Cash, Bank Transfer, Mobile Money"
                    value={formData.paymentMethod}
                    onChange={handleChange}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="paymentFor">Payment For *</Label>
                  <Input
                    id="paymentFor"
                    name="paymentFor"
                    placeholder="e.g. Website Development"
                    value={formData.paymentFor}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="notes">Additional Notes</Label>
              <Textarea
                id="notes"
                name="notes"
                placeholder="Any additional information about this payment"
                value={formData.notes}
                onChange={handleChange}
                rows={3}
              />
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button variant="outline" type="button" onClick={() => router.back()}>
              Cancel
            </Button>
            <Button type="submit">
              <Save className="mr-2 h-4 w-4" /> Generate Receipt
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
}

