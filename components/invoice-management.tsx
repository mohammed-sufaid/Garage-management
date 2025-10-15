import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Separator } from "@/components/ui/separator"
import { useToast } from "@/hooks/use-toast"
import {
  FileText,
  Plus,
  Search,
  Edit,
  Eye,
  User,
  Car,
  Calendar,
  DollarSign,
  Trash2,
  Download,
  Printer,
} from "lucide-react"
import { cn } from "@/lib/utils"

interface InvoiceItem {
  id: string
  description: string
  quantity: number
  unitPrice: number
  total: number
  type: "parts" | "labor"
}

interface Invoice {
  id: string
  invoiceNumber: string
  jobCardId: string
  jobCardNumber: string
  customerId: string
  customerName: string
  customerEmail: string
  customerPhone: string
  customerAddress: string
  vehicleInfo: string
  issueDate: string
  dueDate: string
  items: InvoiceItem[]
  subtotal: number
  taxRate: number
  taxAmount: number
  discount: number
  total: number
  status: "draft" | "sent" | "paid" | "overdue" | "cancelled"
  paymentMethod?: string
  paidDate?: string
  notes: string
  createdAt: string
  updatedAt: string
}

interface JobCard {
  id: string
  jobNumber: string
  customerId: string
  customerName: string
  vehicleInfo: string
  status: string
  estimatedCost: number
  actualCost?: number
}

const mockJobCards: JobCard[] = [
  {
    id: "job-001",
    jobNumber: "JOB-2024-001",
    customerId: "cust-001",
    customerName: "John Smith",
    vehicleInfo: "Honda Civic 2020 (MH01AB1234)",
    status: "completed",
    estimatedCost: 4500,
    actualCost: 4200,
  },
  {
    id: "job-002",
    jobNumber: "JOB-2024-002",
    customerId: "cust-002",
    customerName: "Sarah Johnson",
    vehicleInfo: "Toyota Camry 2019 (DL02CD5678)",
    status: "completed",
    estimatedCost: 6000,
    actualCost: 5800,
  },
]

const mockInvoices: Invoice[] = [
  {
    id: "inv-001",
    invoiceNumber: "INV-2024-001",
    jobCardId: "job-001",
    jobCardNumber: "JOB-2024-001",
    customerId: "cust-001",
    customerName: "John Smith",
    customerEmail: "john.smith@email.com",
    customerPhone: "+91 98765 43210",
    customerAddress: "123 Main Street, Mumbai, Maharashtra 400001",
    vehicleInfo: "Honda Civic 2020 (MH01AB1234)",
    issueDate: "2024-01-17",
    dueDate: "2024-02-16",
    items: [
      {
        id: "item-1",
        description: "Brake Pad Replacement",
        quantity: 1,
        unitPrice: 2500,
        total: 2500,
        type: "parts",
      },
      {
        id: "item-2",
        description: "Labor - Brake Service",
        quantity: 3,
        unitPrice: 500,
        total: 1500,
        type: "labor",
      },
      {
        id: "item-3",
        description: "Engine Oil Change",
        quantity: 1,
        unitPrice: 800,
        total: 800,
        type: "parts",
      },
    ],
    subtotal: 4800,
    taxRate: 18,
    taxAmount: 864,
    discount: 0,
    total: 5664,
    status: "paid",
    paymentMethod: "Cash",
    paidDate: "2024-01-18",
    notes: "Thank you for your business!",
    createdAt: "2024-01-17T10:00:00Z",
    updatedAt: "2024-01-18T14:30:00Z",
  },
  {
    id: "inv-002",
    invoiceNumber: "INV-2024-002",
    jobCardId: "job-002",
    jobCardNumber: "JOB-2024-002",
    customerId: "cust-002",
    customerName: "Sarah Johnson",
    customerEmail: "sarah.j@email.com",
    customerPhone: "+91 87654 32109",
    customerAddress: "456 Oak Avenue, Delhi, Delhi 110001",
    vehicleInfo: "Toyota Camry 2019 (DL02CD5678)",
    issueDate: "2024-01-18",
    dueDate: "2024-02-17",
    items: [
      {
        id: "item-4",
        description: "AC Compressor Repair",
        quantity: 1,
        unitPrice: 4500,
        total: 4500,
        type: "parts",
      },
      {
        id: "item-5",
        description: "Labor - AC System Diagnosis",
        quantity: 4,
        unitPrice: 600,
        total: 2400,
        type: "labor",
      },
    ],
    subtotal: 6900,
    taxRate: 18,
    taxAmount: 1242,
    discount: 200,
    total: 7942,
    status: "sent",
    notes: "Payment due within 30 days",
    createdAt: "2024-01-18T11:00:00Z",
    updatedAt: "2024-01-18T11:00:00Z",
  },
]

interface InvoiceFormData {
  jobCardId: string
  issueDate: string
  dueDate: string
  items: InvoiceItem[]
  taxRate: string
  discount: string
  notes: string
}

const initialFormData: InvoiceFormData = {
  jobCardId: "",
  issueDate: "",
  dueDate: "",
  items: [],
  taxRate: "18",
  discount: "0",
  notes: "",
}

const initialItem: Omit<InvoiceItem, "id" | "total"> = {
  description: "",
  quantity: 1,
  unitPrice: 0,
  type: "parts",
}

export function InvoiceManagement() {
  const [invoices, setInvoices] = useState<Invoice[]>(mockInvoices)
  const [jobCards] = useState<JobCard[]>(mockJobCards)
  const [searchTerm, setSearchTerm] = useState("")
  const [filterStatus, setFilterStatus] = useState("")
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingInvoice, setEditingInvoice] = useState<Invoice | null>(null)
  const [formData, setFormData] = useState<InvoiceFormData>(initialFormData)
  const [errors, setErrors] = useState<Partial<InvoiceFormData>>({})
  const [isLoading, setIsLoading] = useState(false)
  const [viewingInvoice, setViewingInvoice] = useState<Invoice | null>(null)
  const { toast } = useToast()

  const filteredInvoices = invoices.filter((invoice) => {
    const matchesSearch =
      invoice.invoiceNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      invoice.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      invoice.vehicleInfo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      invoice.jobCardNumber.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesStatus = !filterStatus || invoice.status === filterStatus

    return matchesSearch && matchesStatus
  })

  const calculateItemTotal = (quantity: number, unitPrice: number): number => {
    return quantity * unitPrice
  }

  const calculateSubtotal = (items: InvoiceItem[]): number => {
    return items.reduce((sum, item) => sum + item.total, 0)
  }

  const calculateTaxAmount = (subtotal: number, taxRate: number): number => {
    return (subtotal * taxRate) / 100
  }

  const calculateTotal = (subtotal: number, taxAmount: number, discount: number): number => {
    return subtotal + taxAmount - discount
  }

  const validateForm = (): boolean => {
    const newErrors: Partial<InvoiceFormData> = {}

    if (!formData.jobCardId) {
      newErrors.jobCardId = "Job card selection is required"
    }

    if (!formData.issueDate) {
      newErrors.issueDate = "Issue date is required"
    }

    if (!formData.dueDate) {
      newErrors.dueDate = "Due date is required"
    } else if (formData.issueDate && new Date(formData.dueDate) < new Date(formData.issueDate)) {
      newErrors.dueDate = "Due date must be after issue date"
    }

    if (formData.items.length === 0) {
      newErrors.items = "At least one item is required"
    } else {
      const hasInvalidItems = formData.items.some(
        (item) => !item.description.trim() || item.quantity <= 0 || item.unitPrice < 0,
      )
      if (hasInvalidItems) {
        newErrors.items = "All items must have valid description, quantity, and unit price"
      }
    }

    if (!formData.taxRate.trim()) {
      newErrors.taxRate = "Tax rate is required"
    } else if (isNaN(Number.parseFloat(formData.taxRate)) || Number.parseFloat(formData.taxRate) < 0) {
      newErrors.taxRate = "Tax rate must be a valid positive number"
    }

    if (!formData.discount.trim()) {
      newErrors.discount = "Discount is required (use 0 for no discount)"
    } else if (isNaN(Number.parseFloat(formData.discount)) || Number.parseFloat(formData.discount) < 0) {
      newErrors.discount = "Discount must be a valid positive number"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleInputChange = (field: keyof InvoiceFormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }))
    }
  }

  const handleItemChange = (index: number, field: keyof InvoiceItem, value: string | number) => {
    const updatedItems = [...formData.items]
    updatedItems[index] = { ...updatedItems[index], [field]: value }

    // Recalculate total for this item
    if (field === "quantity" || field === "unitPrice") {
      updatedItems[index].total = calculateItemTotal(updatedItems[index].quantity, updatedItems[index].unitPrice)
    }

    setFormData((prev) => ({ ...prev, items: updatedItems }))
  }

  const addItem = () => {
    const newItem: InvoiceItem = {
      ...initialItem,
      id: `item-${Date.now()}`,
      total: 0,
    }
    setFormData((prev) => ({ ...prev, items: [...prev.items, newItem] }))
  }

  const removeItem = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      items: prev.items.filter((_, i) => i !== index),
    }))
  }

  const handleSubmit = async () => {
    if (!validateForm()) {
      toast({
        title: "Validation Error",
        description: "Please fix the errors in the form before saving.",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)

    try {
      await new Promise((resolve) => setTimeout(resolve, 1000))

      const selectedJobCard = jobCards.find((j) => j.id === formData.jobCardId)
      const subtotal = calculateSubtotal(formData.items)
      const taxRate = Number.parseFloat(formData.taxRate)
      const discount = Number.parseFloat(formData.discount)
      const taxAmount = calculateTaxAmount(subtotal, taxRate)
      const total = calculateTotal(subtotal, taxAmount, discount)

      if (editingInvoice) {
        // Update existing invoice
        const updatedInvoice: Invoice = {
          ...editingInvoice,
          jobCardId: formData.jobCardId,
          jobCardNumber: selectedJobCard?.jobNumber || "",
          issueDate: formData.issueDate,
          dueDate: formData.dueDate,
          items: formData.items,
          subtotal,
          taxRate,
          taxAmount,
          discount,
          total,
          notes: formData.notes,
          updatedAt: new Date().toISOString(),
        }
        setInvoices((prev) => prev.map((i) => (i.id === editingInvoice.id ? updatedInvoice : i)))
        toast({
          title: "Success",
          description: "Invoice has been updated successfully.",
        })
      } else {
        // Add new invoice
        const newInvoice: Invoice = {
          id: `inv-${Date.now()}`,
          invoiceNumber: `INV-2024-${String(invoices.length + 1).padStart(3, "0")}`,
          jobCardId: formData.jobCardId,
          jobCardNumber: selectedJobCard?.jobNumber || "",
          customerId: selectedJobCard?.customerId || "",
          customerName: selectedJobCard?.customerName || "",
          customerEmail: "customer@email.com", // This would come from customer data
          customerPhone: "+91 00000 00000", // This would come from customer data
          customerAddress: "Customer Address", // This would come from customer data
          vehicleInfo: selectedJobCard?.vehicleInfo || "",
          issueDate: formData.issueDate,
          dueDate: formData.dueDate,
          items: formData.items,
          subtotal,
          taxRate,
          taxAmount,
          discount,
          total,
          status: "draft",
          notes: formData.notes,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        }
        setInvoices((prev) => [newInvoice, ...prev])
        toast({
          title: "Success",
          description: "New invoice has been created successfully.",
        })
      }

      setIsDialogOpen(false)
      setEditingInvoice(null)
      setFormData(initialFormData)
      setErrors({})
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save invoice. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleEdit = (invoice: Invoice) => {
    setEditingInvoice(invoice)
    setFormData({
      jobCardId: invoice.jobCardId,
      issueDate: invoice.issueDate,
      dueDate: invoice.dueDate,
      items: invoice.items,
      taxRate: invoice.taxRate.toString(),
      discount: invoice.discount.toString(),
      notes: invoice.notes,
    })
    setIsDialogOpen(true)
  }

  const handleAddNew = () => {
    setEditingInvoice(null)
    setFormData(initialFormData)
    setErrors({})
    setIsDialogOpen(true)
  }

  const handleCancel = () => {
    setIsDialogOpen(false)
    setEditingInvoice(null)
    setFormData(initialFormData)
    setErrors({})
  }

  const handleStatusUpdate = async (invoiceId: string, newStatus: Invoice["status"]) => {
    setInvoices((prev) =>
      prev.map((invoice) =>
        invoice.id === invoiceId
          ? {
            ...invoice,
            status: newStatus,
            paidDate: newStatus === "paid" ? new Date().toISOString().split("T")[0] : invoice.paidDate,
            updatedAt: new Date().toISOString(),
          }
          : invoice,
      ),
    )

    toast({
      title: "Status Updated",
      description: `Invoice status has been updated to ${newStatus}.`,
    })
  }

  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case "draft":
        return "bg-gray-100 text-gray-800 hover:bg-gray-100"
      case "sent":
        return "bg-blue-100 text-blue-800 hover:bg-blue-100"
      case "paid":
        return "bg-green-100 text-green-800 hover:bg-green-100"
      case "overdue":
        return "bg-red-100 text-red-800 hover:bg-red-100"
      case "cancelled":
        return "bg-orange-100 text-orange-800 hover:bg-orange-100"
      default:
        return "bg-gray-100 text-gray-800 hover:bg-gray-100"
    }
  }

  const subtotal = calculateSubtotal(formData.items)
  const taxRate = Number.parseFloat(formData.taxRate) || 0
  const discount = Number.parseFloat(formData.discount) || 0
  const taxAmount = calculateTaxAmount(subtotal, taxRate)
  const total = calculateTotal(subtotal, taxAmount, discount)

  const downloadInvoicePDF = async (invoice: Invoice) => {
    const element = document.getElementById(`invoice-${invoice.id}`)
    if (!element) return

    // Dynamically import html2pdf only on client side
    const html2pdf = (await import('html2pdf.js')).default

    const opt = {
      margin: 0.5,
      filename: `Invoice-${invoice.invoiceNumber}.pdf`,
      image: { type: "jpeg", quality: 0.98 },
      html2canvas: { scale: 2 },
      jsPDF: { unit: "in", format: "a4", orientation: "portrait" },
    }

    html2pdf().set(opt).from(element).save()
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="space-y-1">
          <h2 className="text-2xl font-black text-foreground">Invoice Management</h2>
          <p className="text-muted-foreground">Streamline your invoicing process</p>
        </div>

        <Button onClick={handleAddNew} className="gap-2">
          <Plus className="h-4 w-4" />
          Create Invoice
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Invoices</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{invoices.length}</div>
            <p className="text-xs text-muted-foreground">All time</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending</CardTitle>
            <Calendar className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{invoices.filter((i) => i.status === "sent").length}</div>
            <p className="text-xs text-muted-foreground">Awaiting payment</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Paid</CardTitle>
            <DollarSign className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{invoices.filter((i) => i.status === "paid").length}</div>
            <p className="text-xs text-muted-foreground">This month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ₹
              {invoices
                .filter((i) => i.status === "paid")
                .reduce((sum, i) => sum + i.total, 0)
                .toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">Paid invoices</p>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Invoice List</CardTitle>
          <CardDescription>Manage and track all invoices</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-col gap-4 md:flex-row md:items-center">
            <div className="flex items-center gap-2 flex-1">
              <Search className="h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by invoice number, customer, vehicle, or job card..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="max-w-sm"
              />
            </div>

            <div className="flex gap-2">
              <Select value={filterStatus} onValueChange={setFilterStatus}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="All Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="draft">Draft</SelectItem>
                  <SelectItem value="sent">Sent</SelectItem>
                  <SelectItem value="paid">Paid</SelectItem>
                  <SelectItem value="overdue">Overdue</SelectItem>
                  <SelectItem value="cancelled">Cancelled</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Invoice Table */}
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Invoice Details</TableHead>
                  <TableHead>Customer & Vehicle</TableHead>
                  <TableHead>Dates</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredInvoices.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                      {searchTerm || filterStatus ? "No invoices found matching your filters." : "No invoices found."}
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredInvoices.map((invoice) => (
                    <TableRow key={invoice.id}>
                      <TableCell>
                        <div className="space-y-1">
                          <p className="font-medium">{invoice.invoiceNumber}</p>
                          <p className="text-sm text-muted-foreground">Job: {invoice.jobCardNumber}</p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          <div className="flex items-center gap-1 text-sm">
                            <User className="h-3 w-3" />
                            {invoice.customerName}
                          </div>
                          <div className="flex items-center gap-1 text-sm">
                            <Car className="h-3 w-3" />
                            {invoice.vehicleInfo}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          <div className="flex items-center gap-1 text-sm">
                            <Calendar className="h-3 w-3" />
                            Issued: {invoice.issueDate}
                          </div>
                          <div className="flex items-center gap-1 text-sm">
                            <Calendar className="h-3 w-3" />
                            Due: {invoice.dueDate}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm">
                          <p className="font-medium">₹{invoice.total.toLocaleString()}</p>
                          <p className="text-muted-foreground">
                            Tax: ₹{invoice.taxAmount.toLocaleString()} ({invoice.taxRate}%)
                          </p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Select
                          value={invoice.status}
                          onValueChange={(value) => handleStatusUpdate(invoice.id, value as Invoice["status"])}
                        >
                          <SelectTrigger className="w-32">
                            <Badge className={getStatusBadgeColor(invoice.status)}>{invoice.status}</Badge>
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="draft">Draft</SelectItem>
                            <SelectItem value="sent">Sent</SelectItem>
                            <SelectItem value="paid">Paid</SelectItem>
                            <SelectItem value="overdue">Overdue</SelectItem>
                            <SelectItem value="cancelled">Cancelled</SelectItem>
                          </SelectContent>
                        </Select>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setViewingInvoice(invoice)}
                            className="h-8 w-8 p-0"
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="sm" onClick={() => handleEdit(invoice)} className="h-8 w-8 p-0">
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                            <Download className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Add/Edit Invoice Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editingInvoice ? "Edit Invoice" : "Create New Invoice"}</DialogTitle>
            <DialogDescription>
              {editingInvoice ? "Update invoice information below." : "Enter invoice details to create a new invoice."}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-6">
            {/* Basic Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Invoice Information</h3>
              <div className="grid gap-4 md:grid-cols-3">
                <div className="space-y-2">
                  <Label htmlFor="jobCardId">Job Card *</Label>
                  <Select value={formData.jobCardId} onValueChange={(value) => handleInputChange("jobCardId", value)}>
                    <SelectTrigger className={cn(errors.jobCardId && "border-destructive")}>
                      <SelectValue placeholder="Select job card" />
                    </SelectTrigger>
                    <SelectContent>
                      {jobCards
                        .filter((job) => job.status === "completed")
                        .map((jobCard) => (
                          <SelectItem key={jobCard.id} value={jobCard.id}>
                            {jobCard.jobNumber} - {jobCard.customerName}
                          </SelectItem>
                        ))}
                    </SelectContent>
                  </Select>
                  {errors.jobCardId && <p className="text-sm text-destructive">{errors.jobCardId}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="issueDate">Issue Date *</Label>
                  <Input
                    id="issueDate"
                    type="date"
                    value={formData.issueDate}
                    onChange={(e) => handleInputChange("issueDate", e.target.value)}
                    className={cn(errors.issueDate && "border-destructive")}
                  />
                  {errors.issueDate && <p className="text-sm text-destructive">{errors.issueDate}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="dueDate">Due Date *</Label>
                  <Input
                    id="dueDate"
                    type="date"
                    value={formData.dueDate}
                    onChange={(e) => handleInputChange("dueDate", e.target.value)}
                    className={cn(errors.dueDate && "border-destructive")}
                  />
                  {errors.dueDate && <p className="text-sm text-destructive">{errors.dueDate}</p>}
                </div>
              </div>
            </div>

            {/* Invoice Items */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">Invoice Items</h3>
                <Button type="button" variant="outline" onClick={addItem} className="gap-2 bg-transparent">
                  <Plus className="h-4 w-4" />
                  Add Item
                </Button>
              </div>

              {formData.items.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground border-2 border-dashed rounded-lg">
                  <p>No items added yet. Click "Add Item" to get started.</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {formData.items.map((item, index) => (
                    <div key={item.id} className="grid gap-4 md:grid-cols-6 p-4 border rounded-lg">
                      <div className="space-y-2">
                        <Label>Description *</Label>
                        <Input
                          value={item.description}
                          onChange={(e) => handleItemChange(index, "description", e.target.value)}
                          placeholder="Item description"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label>Type</Label>
                        <Select
                          value={item.type}
                          onValueChange={(value) => handleItemChange(index, "type", value as "parts" | "labor")}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="parts">Parts</SelectItem>
                            <SelectItem value="labor">Labor</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <Label>Quantity *</Label>
                        <Input
                          type="number"
                          value={item.quantity}
                          onChange={(e) => handleItemChange(index, "quantity", Number.parseInt(e.target.value) || 0)}
                          min="1"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label>Unit Price (₹) *</Label>
                        <Input
                          type="number"
                          value={item.unitPrice}
                          onChange={(e) => handleItemChange(index, "unitPrice", Number.parseFloat(e.target.value) || 0)}
                          min="0"
                          step="0.01"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label>Total (₹)</Label>
                        <Input value={item.total.toLocaleString()} disabled />
                      </div>

                      <div className="space-y-2">
                        <Label>Action</Label>
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => removeItem(index)}
                          className="w-full"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {errors.items && <p className="text-sm text-destructive">{errors.items}</p>}
            </div>

            {/* Calculations */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Calculations</h3>
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="taxRate">Tax Rate (%) *</Label>
                  <Input
                    id="taxRate"
                    type="number"
                    value={formData.taxRate}
                    onChange={(e) => handleInputChange("taxRate", e.target.value)}
                    placeholder="18"
                    min="0"
                    step="0.01"
                    className={cn(errors.taxRate && "border-destructive")}
                  />
                  {errors.taxRate && <p className="text-sm text-destructive">{errors.taxRate}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="discount">Discount (₹) *</Label>
                  <Input
                    id="discount"
                    type="number"
                    value={formData.discount}
                    onChange={(e) => handleInputChange("discount", e.target.value)}
                    placeholder="0"
                    min="0"
                    step="0.01"
                    className={cn(errors.discount && "border-destructive")}
                  />
                  {errors.discount && <p className="text-sm text-destructive">{errors.discount}</p>}
                </div>
              </div>

              {/* Summary */}
              <div className="bg-muted p-4 rounded-lg space-y-2">
                <div className="flex justify-between">
                  <span>Subtotal:</span>
                  <span>₹{subtotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span>Tax ({taxRate}%):</span>
                  <span>₹{taxAmount.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span>Discount:</span>
                  <span>-₹{discount.toLocaleString()}</span>
                </div>
                <Separator />
                <div className="flex justify-between font-bold text-lg">
                  <span>Total:</span>
                  <span>₹{total.toLocaleString()}</span>
                </div>
              </div>
            </div>

            {/* Notes */}
            <div className="space-y-2">
              <Label htmlFor="notes">Notes</Label>
              <Input
                id="notes"
                value={formData.notes}
                onChange={(e) => handleInputChange("notes", e.target.value)}
                placeholder="Additional notes or payment terms..."
              />
            </div>

            {/* Action Buttons */}
            <div className="flex justify-end gap-2 pt-4">
              <Button variant="outline" onClick={handleCancel} disabled={isLoading}>
                Cancel
              </Button>
              <Button onClick={handleSubmit} disabled={isLoading}>
                {isLoading ? "Saving..." : editingInvoice ? "Update Invoice" : "Create Invoice"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* View Invoice Dialog */}
      <Dialog open={!!viewingInvoice} onOpenChange={() => setViewingInvoice(null)}>
        <DialogContent className="max-w-5xl max-h-[95vh] overflow-y-auto p-0">
          <DialogHeader className="p-6 pb-0">
            <div className="flex items-center justify-between">
              <div>
                <DialogTitle>Professional Invoice</DialogTitle>
                <DialogDescription>Invoice {viewingInvoice?.invoiceNumber}</DialogDescription>
              </div>
              <div className="flex gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => viewingInvoice && downloadInvoicePDF(viewingInvoice)}
                  className="gap-2"
                >
                  <Download className="h-4 w-4" />
                  Download PDF
                </Button>
                <Button variant="outline" size="sm" onClick={() => window.print()} className="gap-2">
                  <Printer className="h-4 w-4" />
                  Print
                </Button>
              </div>
            </div>
          </DialogHeader>

          {viewingInvoice && (
            <div className="p-6">
              <div
                id={`invoice-${viewingInvoice.id}`}
                className="bg-white rounded-lg border print:shadow-none print:border-none max-w-4xl mx-auto"
              >
                {/* Dark Header with Company Info and INVOICE Title */}
                <div className="bg-gray-800 text-white p-6 rounded-t-lg">
                  <div className="flex justify-between items-start">
                    <div className="text-sm space-y-1">
                      <p className="font-semibold">AutoCare Garage</p>
                      <p>123 Main Street</p>
                      <p>City, Province, Postal code</p>
                      <p>(123) 456-7890</p>
                      <p>info@autocare.com</p>
                    </div>
                    <div>
                      <h1 className="text-4xl font-bold tracking-wider">INVOICE</h1>
                    </div>
                  </div>
                </div>

                {/* Green Accent Stripe */}
                <div className="h-2 bg-green-500"></div>

                {/* Invoice Details Section */}
                <div className="p-6">
                  <div className="flex justify-between mb-8">
                    {/* Invoice To */}
                    <div>
                      <h3 className="font-semibold text-gray-800 mb-2">INVOICE TO</h3>
                      <div className="text-sm text-gray-600 space-y-1">
                        <p className="font-semibold text-gray-800">{viewingInvoice.customerName}</p>
                        <p>{viewingInvoice.customerPhone}</p>
                        <p>City, Province, Postal code</p>
                      </div>
                    </div>

                    {/* Invoice Details */}
                    <div className="text-right">
                      <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
                        <div className="text-gray-600">INVOICE #</div>
                        <div className="font-semibold">{viewingInvoice.invoiceNumber}</div>
                        <div className="text-gray-600">DATE</div>
                        <div className="font-semibold">{viewingInvoice.issueDate}</div>
                        <div className="text-gray-600">DUE DATE</div>
                        <div className="font-semibold">{viewingInvoice.dueDate}</div>
                        <div className="text-gray-600">TERMS</div>
                        <div className="font-semibold">Net 30</div>
                      </div>
                    </div>
                  </div>

                  {/* Items Table */}
                  <div className="mb-8">
                    <table className="w-full border-collapse">
                      <thead>
                        <tr className="bg-green-500 text-white">
                          <th className="text-left p-3 font-semibold">DESCRIPTION</th>
                          <th className="text-center p-3 font-semibold">QTY</th>
                          <th className="text-center p-3 font-semibold">RATE</th>
                          <th className="text-right p-3 font-semibold">AMOUNT</th>
                        </tr>
                      </thead>
                      <tbody>
                        {viewingInvoice.items.map((item, index) => (
                          <tr key={item.id} className="border-b border-gray-200">
                            <td className="p-3">
                              <div className="font-semibold text-gray-800">{item.description}</div>
                              <div className="text-sm text-gray-600">
                                {item.type === "parts" ? "Auto Part" : "Service"}
                              </div>
                            </td>
                            <td className="text-center p-3">{item.quantity}</td>
                            <td className="text-center p-3">₹{item.unitPrice.toLocaleString()}</td>
                            <td className="text-right p-3 font-semibold">₹{item.total.toLocaleString()}</td>
                          </tr>
                        ))}
                        {/* Add empty rows to match template */}
                        {Array.from({ length: Math.max(0, 4 - viewingInvoice.items.length) }).map((_, index) => (
                          <tr key={`empty-${index}`} className="border-b border-gray-200">
                            <td className="p-3">
                              <div className="font-semibold text-gray-800">-</div>
                              <div className="text-sm text-gray-600">-</div>
                            </td>
                            <td className="text-center p-3">0</td>
                            <td className="text-center p-3">0</td>
                            <td className="text-right p-3 font-semibold">₹0.00</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  {/* Bottom Section with Message and Totals */}
                  <div className="flex justify-between items-start">
                    {/* Message Section */}
                    <div className="w-1/2">
                      <h4 className="font-semibold text-gray-800 mb-2">MESSAGE</h4>
                      <div className="bg-gray-50 p-3 rounded border min-h-[100px]">
                        <p className="text-sm text-gray-600">
                          {viewingInvoice.notes ||
                            "Thank you for choosing AutoCare Garage. We appreciate your business!"}
                        </p>
                      </div>
                    </div>

                    {/* Totals Section */}
                    <div className="w-1/3">
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-600">SUBTOTAL</span>
                          <span className="font-semibold">₹{viewingInvoice.subtotal.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">DISCOUNT</span>
                          <span className="font-semibold">₹{viewingInvoice.discount.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">TAX</span>
                          <span className="font-semibold">₹{viewingInvoice.taxAmount.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between border-t border-gray-300 pt-2">
                          <span className="font-semibold text-gray-800">TOTAL</span>
                          <span className="font-bold text-lg">₹{viewingInvoice.total.toLocaleString()}</span>
                        </div>
                      </div>

                      <div className="mt-6 pt-4 border-t border-gray-300">
                        <div className="flex justify-between">
                          <span className="font-bold text-lg text-gray-800">BALANCE DUE</span>
                          <span className="font-bold text-lg">₹{viewingInvoice.total.toLocaleString()}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Footer with branding */}
                  <div className="mt-8 pt-4 border-t border-gray-200 text-center">
                    <p className="text-xs text-gray-500">
                      This invoice is brought to you by <span className="font-semibold">AutoCare Garage</span>
                    </p>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex justify-end gap-2 mt-6 print:hidden">
                <Button variant="outline" onClick={() => setViewingInvoice(null)}>
                  Close
                </Button>
                <Button
                  onClick={() => {
                    setViewingInvoice(null)
                    handleEdit(viewingInvoice)
                  }}
                  className="gap-2"
                >
                  <Edit className="h-4 w-4" />
                  Edit Invoice
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
