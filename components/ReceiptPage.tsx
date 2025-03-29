"use client"


import type { Receipt } from "@prisma/client"
import { useRouter } from "next/navigation"
import { useEffect, useState, useRef } from "react"
import { toast } from "sonner"
import { ReceiptView } from "@/components/receipt-view"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { ArrowLeft, Download, Printer } from "lucide-react"
import Link from "next/link"
import { toPng } from "html-to-image"
import { jsPDF } from "jspdf"
import { fetchReceiptById } from "@/app/actions/receipt"

type ReceiptPageProps = {
    id: string
  }

export default function ReceiptPage({ id }: ReceiptPageProps) {
 
  const router = useRouter()
  const [receipt, setReceipt] = useState<Receipt | null>(null)
  const [loading, setLoading] = useState(true)
  const receiptRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    async function loadReceipt() {
      try {
        const result = await fetchReceiptById(id)
        if (result.success && result.data) {
          setReceipt(result.data)
        } else {
          toast.error(result.error || "Failed to fetch receipt")
          router.push("/dashboard")
        }
      } catch (error) {
        toast.error("An error occurred while fetching the receipt")
        router.push("/dashboard")
      } finally {
        setLoading(false)
      }
    }

    loadReceipt()
  }, [id, router])

  const handlePrint = () => {
    window.print()
  }

  const handleDownloadImage = async () => {
    if (!receiptRef.current || !receipt) return

    try {
      const dataUrl = await toPng(receiptRef.current, { quality: 1.0 })
      const link = document.createElement("a")
      link.download = `Receipt-${receipt.receiptNumber}.png`
      link.href = dataUrl
      link.click()

      toast.success("Receipt image downloaded successfully")
    } catch (error) {
      toast.error("Failed to download receipt as image")
    }
  }

  const handleDownloadPDF = async () => {
    if (!receiptRef.current || !receipt) return

    try {
      const dataUrl = await toPng(receiptRef.current, { quality: 1.0 })
      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: "a4",
      })

      // Calculate aspect ratio to fit the image properly
      const imgProps = pdf.getImageProperties(dataUrl)
      const pdfWidth = pdf.internal.pageSize.getWidth()
      const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width

      pdf.addImage(dataUrl, "PNG", 0, 0, pdfWidth, pdfHeight)
      pdf.save(`Receipt-${receipt.receiptNumber}.pdf`)

      toast.success("Receipt PDF downloaded successfully")
    } catch (error) {
      toast.error("Failed to download receipt as PDF")
    }
  }

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-12 flex justify-center">
        <div className="animate-pulse">Loading receipt...</div>
      </div>
    )
  }

  if (!receipt) {
    return (
      <div className="container mx-auto px-4 py-12">
        <Card className="p-6 text-center">
          <h2 className="text-xl font-semibold mb-2">Receipt Not Found</h2>
          <p className="text-muted-foreground mb-4">The requested receipt could not be found.</p>
          <Link href="/dashboard">
            <Button>Go to Dashboard</Button>
          </Link>
        </Card>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <Link href="/dashboard" className="inline-flex items-center text-primary hover:underline">
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to Dashboard
        </Link>

        <div className="flex flex-wrap gap-2 print:hidden">
          <Button variant="outline" onClick={handlePrint}>
            <Printer className="mr-2 h-4 w-4" /> Print
          </Button>
          <Button variant="outline" onClick={handleDownloadImage}>
            <Download className="mr-2 h-4 w-4" /> Save as Image
          </Button>
          <Button variant="outline" onClick={handleDownloadPDF}>
            <Download className="mr-2 h-4 w-4" /> Save as PDF
          </Button>
        </div>
      </div>

      <div ref={receiptRef}>
        <ReceiptView receipt={receipt} />
      </div>
    </div>
  )
}

