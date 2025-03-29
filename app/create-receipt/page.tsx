"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { ArrowLeft, Save } from "lucide-react"
import Link from "next/link"
import { toast } from "sonner"
import { createReceipt } from "@/app/actions/receipt"

// Define the Receipt type for the form
export type ReceiptFormProps = {
  id: string
  customerName: string
  customerEmail: string
  customerPhone: string
  receiptNumber: string
  date: string
  totalAmount: string
  amountPaid: string
  paymentMethod: string
  paymentFor: string
  notes: string
  currency: string
  createdAt: string
  updatedAt: string
}

export default function CreateReceipt() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  // Initialize react-hook-form
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ReceiptFormProps>({
    defaultValues: {
      id: "",
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
      currency: "UGX", // Default to Uganda Shillings
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
  })

  // Form submission handler
  const saveData = async (data: ReceiptFormProps) => {
    try {
      setLoading(true)

      // Convert form data to Prisma-compatible data
      const result = await createReceipt({
        customerName: data.customerName,
        customerEmail: data.customerEmail || null,
        customerPhone: data.customerPhone || null,
        receiptNumber: data.receiptNumber,
        date: new Date(data.date),
        totalAmount: Number(data.totalAmount),
        amountPaid: Number(data.amountPaid),
        paymentMethod: data.paymentMethod || null,
        paymentFor: data.paymentFor,
        notes: data.notes || null,
        currency: data.currency,
      })

      if (result.success) {
        toast.success("Receipt created successfully")
        router.push(`/receipt/${result.id}`)
      } else {
        toast.error(result.error || "Failed to create receipt")
      }
    } catch (error) {
      toast.error("An error occurred while creating the receipt")
      console.error(error)
    } finally {
      setLoading(false)
    }
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
        <form onSubmit={handleSubmit(saveData)}>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Customer Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="customerName">Customer Name *</Label>
                  <Input
                    id="customerName"
                    {...register("customerName", {
                      required: "Customer name is required",
                    })}
                  />
                  {errors.customerName && <p className="text-sm text-red-500">{errors.customerName.message}</p>}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="customerEmail">Customer Email</Label>
                  <Input
                    id="customerEmail"
                    type="email"
                    {...register("customerEmail", {
                      pattern: {
                        value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                        message: "Invalid email address",
                      },
                    })}
                  />
                  {errors.customerEmail && <p className="text-sm text-red-500">{errors.customerEmail.message}</p>}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="customerPhone">Customer Phone</Label>
                  <Input id="customerPhone" {...register("customerPhone")} />
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-medium">Payment Details</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="receiptNumber">Receipt Number</Label>
                  <Input id="receiptNumber" {...register("receiptNumber")} readOnly />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="date">Date</Label>
                  <Input
                    id="date"
                    type="date"
                    {...register("date", {
                      required: "Date is required",
                    })}
                  />
                  {errors.date && <p className="text-sm text-red-500">{errors.date.message}</p>}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="totalAmount">Total Amount *</Label>
                  <Input
                    id="totalAmount"
                    type="number"
                    min="0"
                    step="0.01"
                    {...register("totalAmount", {
                      required: "Total amount is required",
                      min: {
                        value: 0,
                        message: "Amount must be greater than 0",
                      },
                    })}
                  />
                  {errors.totalAmount && <p className="text-sm text-red-500">{errors.totalAmount.message}</p>}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="amountPaid">Amount Paid *</Label>
                  <Input
                    id="amountPaid"
                    type="number"
                    min="0"
                    step="0.01"
                    {...register("amountPaid", {
                      required: "Amount paid is required",
                      min: {
                        value: 0,
                        message: "Amount must be greater than 0",
                      },
                    })}
                  />
                  {errors.amountPaid && <p className="text-sm text-red-500">{errors.amountPaid.message}</p>}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="currency">Currency *</Label>
                  <select
                    id="currency"
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    {...register("currency", {
                      required: "Currency is required",
                    })}
                  >
                    <option value="UGX">UGX (Uganda Shillings)</option>
                    <option value="USD">USD (US Dollars)</option>
                    <option value="EUR">EUR (Euros)</option>
                    <option value="KES">KES (Kenya Shillings)</option>
                    <option value="TZS">TZS (Tanzania Shillings)</option>
                  </select>
                  {errors.currency && <p className="text-sm text-red-500">{errors.currency.message}</p>}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="paymentMethod">Payment Method</Label>
                  <Input
                    id="paymentMethod"
                    placeholder="e.g. Cash, Bank Transfer, Mobile Money"
                    {...register("paymentMethod")}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="paymentFor">Payment For *</Label>
                  <Input
                    id="paymentFor"
                    placeholder="e.g. Website Development"
                    {...register("paymentFor", {
                      required: "Payment purpose is required",
                    })}
                  />
                  {errors.paymentFor && <p className="text-sm text-red-500">{errors.paymentFor.message}</p>}
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="notes">Additional Notes</Label>
              <Textarea
                id="notes"
                placeholder="Any additional information about this payment"
                rows={3}
                {...register("notes")}
              />
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button variant="outline" type="button" onClick={() => router.back()} disabled={loading}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-t-2 border-white rounded-full animate-spin" />
                  Creating Receipt...
                </div>
              ) : (
                <>
                  <Save className="mr-2 h-4 w-4" /> Generate Receipt
                </>
              )}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
}

