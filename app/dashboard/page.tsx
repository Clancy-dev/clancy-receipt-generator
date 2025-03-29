"use client"

import type React from "react"

import { fetchReceipts, deleteReceipt } from "@/app/actions/receipt"
import type { Receipt } from "@prisma/client"
import { useEffect, useState } from "react"
import { toast } from "sonner"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { ArrowLeft, FileText, Plus, Search, Trash2 } from "lucide-react"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { formatCurrency } from "@/lib/utils"

export default function Dashboard() {
  const [receipts, setReceipts] = useState<Receipt[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [receiptToDelete, setReceiptToDelete] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadReceipts() {
      try {
        const result = await fetchReceipts()
        if (result.success && result.data) {
          setReceipts(result.data)
        } else {
          toast.error(result.error || "Failed to fetch receipts")
        }
      } catch (error) {
        toast.error("An error occurred while fetching receipts")
      } finally {
        setLoading(false)
      }
    }

    loadReceipts()
  }, [])

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value)
  }

  const handleDelete = async (id: string) => {
    try {
      const result = await deleteReceipt(id)
      if (result.success) {
        // Remove from local state to avoid refetching
        setReceipts(receipts.filter((receipt) => receipt.id !== id))
        toast.success("Receipt deleted successfully")
        setReceiptToDelete(null)
      } else {
        toast.error(result.error || "Failed to delete receipt")
      }
    } catch (error) {
      toast.error("An error occurred while deleting the receipt")
    }
  }

  const filteredReceipts = receipts.filter(
    (receipt) =>
      receipt.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      receipt.receiptNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      receipt.paymentFor.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  // Sort receipts by date (newest first)
  const sortedReceipts = [...filteredReceipts].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
  )

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="flex justify-center items-center h-64">
          <div className="animate-pulse text-lg">Loading receipts...</div>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <Link href="/" className="inline-flex items-center mb-6 text-primary hover:underline">
        <ArrowLeft className="mr-2 h-4 w-4" /> Back to Home
      </Link>

      <Card>
        <CardHeader className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <CardTitle>Customer Receipts</CardTitle>
            <CardDescription>Manage all your customer payment receipts</CardDescription>
          </div>
          <Link href="/create-receipt">
            <Button>
              <Plus className="mr-2 h-4 w-4" /> New Receipt
            </Button>
          </Link>
        </CardHeader>
        <CardContent>
          <div className="relative mb-6">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by customer name, receipt number, or payment purpose..."
              className="pl-10"
              value={searchTerm}
              onChange={handleSearch}
            />
          </div>

          {receipts.length === 0 ? (
            <div className="text-center py-12">
              <FileText className="mx-auto h-12 w-12 text-muted-foreground opacity-50" />
              <h3 className="mt-4 text-lg font-medium">No receipts yet</h3>
              <p className="mt-2 text-sm text-muted-foreground">Create your first receipt to get started</p>
              <Link href="/create-receipt" className="mt-4 inline-block">
                <Button>
                  <Plus className="mr-2 h-4 w-4" /> Create Receipt
                </Button>
              </Link>
            </div>
          ) : sortedReceipts.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-muted-foreground">No receipts match your search</p>
            </div>
          ) : (
            <div className="rounded-md border overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Receipt #</TableHead>
                    <TableHead>Customer</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Payment For</TableHead>
                    <TableHead className="text-right">Amount</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {sortedReceipts.map((receipt) => (
                    <TableRow key={receipt.id}>
                      <TableCell className="font-medium">{receipt.receiptNumber}</TableCell>
                      <TableCell>{receipt.customerName}</TableCell>
                      <TableCell>{new Date(receipt.date).toLocaleDateString()}</TableCell>
                      <TableCell>{receipt.paymentFor}</TableCell>
                      <TableCell className="text-right">
                        {formatCurrency(receipt.amountPaid, receipt.currency)}
                        {receipt.amountPaid < receipt.totalAmount && (
                          <span className="text-xs text-muted-foreground ml-1">
                            of {formatCurrency(receipt.totalAmount, receipt.currency)}
                          </span>
                        )}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Link href={`/receipt/${receipt.id}`}>
                            <Button variant="ghost" size="sm">
                              <FileText className="h-4 w-4" />
                              <span className="sr-only">View</span>
                            </Button>
                          </Link>

                          <AlertDialog
                            open={receiptToDelete === receipt.id}
                            onOpenChange={(open) => {
                              if (!open) setReceiptToDelete(null)
                            }}
                          >
                            <AlertDialogTrigger asChild>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="text-destructive hover:text-destructive"
                                onClick={() => setReceiptToDelete(receipt.id)}
                              >
                                <Trash2 className="h-4 w-4" />
                                <span className="sr-only">Delete</span>
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                                <AlertDialogDescription>
                                  This will permanently delete receipt #{receipt.receiptNumber} for{" "}
                                  {receipt.customerName}. This action cannot be undone.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction
                                  className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                                  onClick={() => handleDelete(receipt.id)}
                                >
                                  Delete
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

