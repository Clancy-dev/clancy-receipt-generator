import { getReceiptById } from "@/actions/receipt"
import { ReceiptView } from "@/components/receipt-view"
import { Card } from "@/components/ui/card"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ReceiptActions } from "@/components/receipt-actions"

export default async function ReceiptPage({
  params,
}: {
  params: { id: string }
}) {
  const { id } = await params

  // Fetch data on the server
  const result = await getReceiptById(id)

  if (!result.success || !result.data) {
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
      </div>

      <ReceiptView receipt={result.data} />

      {/* Client Component for Actions */}
      <ReceiptActions receipt={result.data} />
    </div>
  )
}
