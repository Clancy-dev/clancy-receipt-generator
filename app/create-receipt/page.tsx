// Modified version of app/create-receipt/page.tsx
"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"

import { toast } from "sonner"
import { createReceipt } from "@/actions/receipt"
// ... other imports

export default function CreateReceipt() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    // ... same form state
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    // Create FormData object
    const formDataObj = new FormData()
    Object.entries(formData).forEach(([key, value]) => {
      if (value !== null && value !== undefined) {
        formDataObj.append(key, value.toString()) // Convert to string safely
      } else {
        formDataObj.append(key, "") // Use an empty string for null/undefined values
      }
    })
    
    // Call server action
    const result = await createReceipt(formDataObj)
    
    if (result.success) {
      toast.success("Receipt created successfully")
      router.push(`/receipt/${result.id}`)
    } else {
      toast.error(result.error || "Failed to create receipt")
    }
  }
  
  // ... rest of component remains similar
}