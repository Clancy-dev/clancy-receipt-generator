"use client"

import { useRef } from "react"
import { Card } from "@/components/ui/card"
// import { PieChart, Pie, Cell, ResponsiveContainer } from "@/components/ui/chart"
import { QRCodeSVG } from "qrcode.react" // Changed from QRCode to QRCodeSVG
import { formatCurrency } from "@/lib/utils"
import { Receipt } from "@/app/types"
import { Cell, Pie, PieChart, ResponsiveContainer } from "recharts"
// import type { Receipt } from "@/types/receipt"

type ReceiptProps = {
  receipt: Receipt
}

export function ReceiptView({ receipt }: ReceiptProps) {
  const qrValue = useRef(
    `Receipt: ${receipt.receiptNumber}\nCustomer: ${receipt.customerName}\nAmount: ${formatCurrency(receipt.amountPaid, receipt.currency)}\nDate: ${new Date(receipt.date).toLocaleDateString()}`,
  )

  const remainingAmount = receipt.totalAmount - receipt.amountPaid
  const paymentPercentage = (receipt.amountPaid / receipt.totalAmount) * 100

  const COLORS = ["#4f46e5", "#e5e7eb"]
  const data = [
    { name: "Paid", value: receipt.amountPaid },
    { name: "Remaining", value: remainingAmount > 0 ? remainingAmount : 0 },
  ]

  return (
    <Card className="max-w-3xl mx-auto p-8 print:shadow-none print:border-none">
      <div className="flex flex-col gap-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b pb-6">
          <div>
            <h1 className="text-2xl font-bold">RECEIPT</h1>
            <p className="text-muted-foreground">{receipt.receiptNumber}</p>
          </div>
          <div className="text-right mt-4 sm:mt-0">
            <p className="font-medium">Clancy Ssekisambu</p>
            <p className="text-sm text-muted-foreground">Web Developer</p>
            <p className="text-sm text-muted-foreground">Kireka, Uganda</p>
            <p className="text-sm text-muted-foreground">+256 770983239</p>
          </div>
        </div>

        {/* Customer Info */}
        <div>
          <h2 className="text-lg font-semibold mb-2">Customer Information</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-muted-foreground">Customer Name</p>
              <p className="font-medium">{receipt.customerName}</p>
            </div>
            {receipt.customerEmail && (
              <div>
                <p className="text-sm text-muted-foreground">Email</p>
                <p>{receipt.customerEmail}</p>
              </div>
            )}
            {receipt.customerPhone && (
              <div>
                <p className="text-sm text-muted-foreground">Phone</p>
                <p>{receipt.customerPhone}</p>
              </div>
            )}
            <div>
              <p className="text-sm text-muted-foreground">Date</p>
              <p>{new Date(receipt.date).toLocaleDateString()}</p>
            </div>
          </div>
        </div>

        {/* Payment Details */}
        <div>
          <h2 className="text-lg font-semibold mb-2">Payment Details</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-muted-foreground">Payment For</p>
              <p className="font-bold">{receipt.paymentFor}</p>
            </div>
            {receipt.paymentMethod && (
              <div>
                <p className="text-sm text-muted-foreground">Payment Method</p>
                <p>{receipt.paymentMethod}</p>
              </div>
            )}
            <div>
              <p className="text-sm text-muted-foreground">Total Amount</p>
              <p>{formatCurrency(receipt.totalAmount, receipt.currency)}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Amount Paid</p>
              <p className="font-medium">{formatCurrency(receipt.amountPaid, receipt.currency)}</p>
            </div>
            {remainingAmount > 0 && (
              <div>
                <p className="text-sm text-muted-foreground">Remaining Balance</p>
                <p>{formatCurrency(remainingAmount, receipt.currency)}</p>
              </div>
            )}
          </div>
        </div>

        {/* Payment Visualization */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mt-4">
          {/* Pie Chart */}
          <div>
            <h3 className="text-sm font-medium mb-2 text-center">Payment Progress</h3>
            <div className="h-[200px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={data} cx="50%" cy="50%" innerRadius={60} outerRadius={80} paddingAngle={4} dataKey="value">
                    {data.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="flex justify-center items-center gap-6 mt-2">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-[#4f46e5]"></div>
                <span className="text-sm">Paid ({Math.round(paymentPercentage)}%)</span>
              </div>
              {remainingAmount > 0 && (
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-[#e5e7eb]"></div>
                  <span className="text-sm">Remaining ({Math.round(100 - paymentPercentage)}%)</span>
                </div>
              )}
            </div>
          </div>

          {/* QR Code */}
          <div className="flex flex-col items-center justify-center">
            <h3 className="text-sm font-medium mb-2">Receipt QR Code</h3>
            <div className="bg-white p-2 rounded-md">
              <QRCodeSVG value={qrValue.current} size={150} />
            </div>
            <p className="text-xs text-muted-foreground mt-2 text-center">Scan to verify receipt</p>
          </div>
        </div>

        {/* Notes */}
        {receipt.notes && (
          <div className="mt-4">
            <h3 className="text-sm font-medium mb-1">Notes</h3>
            <p className="text-sm text-muted-foreground">{receipt.notes}</p>
          </div>
        )}

        {/* Footer */}
        <div className="border-t pt-6 mt-6 text-center">
          <p className="text-sm">Thank you for your business!</p>
          <p className="text-xs text-muted-foreground mt-1">
            This receipt was generated by Clancy Ssekisambu's Receipt Generator
          </p>
        </div>
      </div>
    </Card>
  )
}

