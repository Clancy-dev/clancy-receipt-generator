import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowRight, FileText, PieChart, QrCode, Users } from "lucide-react"

export default function Home() {
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="flex flex-col items-center text-center mb-12">
        <h1 className="text-4xl font-bold tracking-tight">Receipt Generator</h1>
        <p className="text-lg text-muted-foreground mt-4 max-w-2xl">
          Generate professional receipts for your clients with payment tracking, pie charts, and QR codes
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
        <Link href="/create-receipt" className="block">
          <Card className="h-full transition-all hover:shadow-lg">
            <CardHeader className="flex flex-row items-center gap-4">
              <div className="bg-primary/10 p-3 rounded-full">
                <FileText className="h-8 w-8 text-primary" />
              </div>
              <div>
                <CardTitle>Create New Receipt</CardTitle>
                <CardDescription>Generate a new receipt for a client payment</CardDescription>
              </div>
            </CardHeader>
            <CardContent className="flex justify-end">
              <Button variant="ghost" className="group">
                Get Started <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </Button>
            </CardContent>
          </Card>
        </Link>

        <Link href="/dashboard" className="block">
          <Card className="h-full transition-all hover:shadow-lg">
            <CardHeader className="flex flex-row items-center gap-4">
              <div className="bg-primary/10 p-3 rounded-full">
                <Users className="h-8 w-8 text-primary" />
              </div>
              <div>
                <CardTitle>Customer Dashboard</CardTitle>
                <CardDescription>View and manage all your customer receipts</CardDescription>
              </div>
            </CardHeader>
            <CardContent className="flex justify-end">
              <Button variant="ghost" className="group">
                View Dashboard <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </Button>
            </CardContent>
          </Card>
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-16 max-w-5xl mx-auto">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <PieChart className="h-5 w-5 text-primary" />
              Payment Tracking
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              Visualize payment progress with interactive pie charts showing paid vs. outstanding amounts
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <QrCode className="h-5 w-5 text-primary" />
              QR Codes
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              Each receipt includes a unique QR code for easy verification and digital access
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5 text-primary" />
              Multiple Formats
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              Export receipts as images, PDFs, or documents for versatile sharing options
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="mt-16 text-center">
        <p className="text-muted-foreground">Developed for Clancy Ssekisambu | Web Developer | Uganda</p>
      </div>
    </div>
  )
}

