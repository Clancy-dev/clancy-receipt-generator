import { getReceiptById } from "@/actions/receipt"
import { ReceiptView } from "@/components/receipt-view"



export default async function ReceiptPage({params}: {params: Promise<{ id: string}>}) {
  const { id } = await params // No need for 'await' here

  const result = await getReceiptById(id)

  if (!result.success || !result.data) {
    return <div>Receipt not found</div>
  }

  return <ReceiptView receipt={result.data} />
}


