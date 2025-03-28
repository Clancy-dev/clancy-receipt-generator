"use client"

import { toPng } from "html-to-image"
import { jsPDF } from "jspdf"
import { Button } from "@/components/ui/button"
import { Printer, Download } from "lucide-react"
import { toast } from "sonner"
import { useRef } from "react"
import { Receipt } from "@/app/types"
import { ReceiptView } from "./receipt-view"

export function ReceiptActions({ receipt }: { receipt: Receipt }) {
  const receiptRef = useRef<HTMLDivElement>(null)

  const handlePrint = () => {
    window.print()
  }

  const handleDownloadImage = async () => {
    if (!receiptRef.current) return

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
    if (!receiptRef.current) return

    try {
      const dataUrl = await toPng(receiptRef.current, { quality: 1.0 })
      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: "a4",
      })

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

  return (
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

      <div ref={receiptRef} style={{ display: "none" }}>
        {/* Hidden div for image & PDF export */}
        <ReceiptView receipt={receipt} />
      </div>
    </div>
  )
}
