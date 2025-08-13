"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { useToast } from "@/hooks/use-toast"
import { ClipboardList, Plus, Search, Edit, Eye, User, Car, Calendar, Clock, Wrench, CheckCircle } from "lucide-react"
import { cn } from "@/lib/utils"

interface JobCard {
  id: string
  jobNumber: string
  customerId: string
  customerName: string
  vehicleId: string
  vehicleInfo: string
  dateIn: string
  expectedDelivery: string
  actualDelivery?: string
  problemDescription: string
  workDescription: string
  assignedMechanic: string
  repairCategory: "maintenance" | "repair" | "inspection" | "bodywork" | "electrical"
  priority: "low" | "medium" | "high" | "urgent"
  status: "pending" | "in-progress" | "completed" | "delivered" | "cancelled"
  estimatedCost: number
  actualCost?: number
  laborHours: number
  createdAt: string
  updatedAt: string
}

interface Customer {
  id: string
  name: string
  phone: string
}

interface Vehicle {
  id: string
  registrationNo: string
  brand: string
  model: string
  year: number
  customerId: string
}

const mockCustomers: Customer[] = [
  { id: "cust-001", name: "John Smith", phone: "+91 98765 43210" },
  { id: "cust-002", name: "Sarah Johnson", phone: "+91 87654 32109" },
  { id: "cust-003", name: "Michael Brown", phone: "+91 76543 21098" },
]

const mockVehicles: Vehicle[] = [
  { id: "veh-001", registrationNo: "MH01AB1234", brand: "Honda", model: "Civic", year: 2020, customerId: "cust-001" },
  { id: "veh-002", registrationNo: "DL02CD5678", brand: "Toyota", model: "Camry", year: 2019, customerId: "cust-002" },
  { id: "veh-003", registrationNo: "KA03EF9012", brand: "BMW", model: "X5", year: 2021, customerId: "cust-003" },
]

const mockJobCards: JobCard[] = [
  {
    id: "job-001",
    jobNumber: "JOB-2024-001",
    customerId: "cust-001",
    customerName: "John Smith",
    vehicleId: "veh-001",
    vehicleInfo: "Honda Civic 2020 (MH01AB1234)",
    dateIn: "2024-01-15",
    expectedDelivery: "2024-01-17",
    actualDelivery: "2024-01-17",
    problemDescription: "Engine making unusual noise, brake pads need replacement",
    workDescription: "Replaced brake pads, cleaned engine components, oil change",
    assignedMechanic: "Raj Kumar",
    repairCategory: "maintenance",
    priority: "medium",
    status: "completed",
    estimatedCost: 4500,
    actualCost: 4200,
    laborHours: 6,
    createdAt: "2024-01-15T09:00:00Z",
    updatedAt: "2024-01-17T16:30:00Z",
  },
  {
    id: "job-002",
    jobNumber: "JOB-2024-002",
    customerId: "cust-002",
    customerName: "Sarah Johnson",
    vehicleId: "veh-002",
    vehicleInfo: "Toyota Camry 2019 (DL02CD5678)",
    dateIn: "2024-01-16",
    expectedDelivery: "2024-01-18",
    problemDescription: "AC not cooling properly, battery warning light on",
    workDescription: "Diagnosing AC system and battery issues",
    assignedMechanic: "Amit Singh",
    repairCategory: "repair",
    priority: "high",
    status: "in-progress",
    estimatedCost: 6000,
    laborHours: 8,
    createdAt: "2024-01-16T10:30:00Z",
    updatedAt: "2024-01-16T14:00:00Z",
  },
  {
    id: "job-003",
    jobNumber: "JOB-2024-003",
    customerId: "cust-003",
    customerName: "Michael Brown",
    vehicleId: "veh-003",
    vehicleInfo: "BMW X5 2021 (KA03EF9012)",
    dateIn: "2024-01-17",
    expectedDelivery: "2024-01-19",
    problemDescription: "Routine service - 20,000 km service due",
    workDescription: "Complete service package including oil, filters, inspection",
    assignedMechanic: "Suresh Patel",
    repairCategory: "maintenance",
    priority: "low",
    status: "pending",
    estimatedCost: 8500,
    laborHours: 4,
    createdAt: "2024-01-17T11:00:00Z",
    updatedAt: "2024-01-17T11:00:00Z",
  },
]

interface JobCardFormData {
  customerId: string
  vehicleId: string
  dateIn: string
  expectedDelivery: string
  problemDescription: string
  workDescription: string
  assignedMechanic: string
  repairCategory: "maintenance" | "repair" | "inspection" | "bodywork" | "electrical" | ""
  priority: "low" | "medium" | "high" | "urgent" | ""
  estimatedCost: string
  laborHours: string
}

const initialFormData: JobCardFormData = {
  customerId: "",
  vehicleId: "",
  dateIn: "",
  expectedDelivery: "",
  problemDescription: "",
  workDescription: "",
  assignedMechanic: "",
  repairCategory: "",
  priority: "",
  estimatedCost: "",
  laborHours: "",
}

const repairCategories = [
  { value: "maintenance", label: "Maintenance" },
  { value: "repair", label: "Repair" },
  { value: "inspection", label: "Inspection" },
  { value: "bodywork", label: "Bodywork" },
  { value: "electrical", label: "Electrical" },
]

const priorities = [
  { value: "low", label: "Low" },
  { value: "medium", label: "Medium" },
  { value: "high", label: "High" },
  { value: "urgent", label: "Urgent" },
]

const mechanics = ["Raj Kumar", "Amit Singh", "Suresh Patel", "Vikram Sharma", "Ravi Gupta"]

export function JobCardManagement() {
  const [jobCards, setJobCards] = useState<JobCard[]>(mockJobCards)
  const [customers] = useState<Customer[]>(mockCustomers)
  const [vehicles] = useState<Vehicle[]>(mockVehicles)
  const [searchTerm, setSearchTerm] = useState("")
  const [filterStatus, setFilterStatus] = useState("")
  const [filterPriority, setFilterPriority] = useState("")
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingJobCard, setEditingJobCard] = useState<JobCard | null>(null)
  const [formData, setFormData] = useState<JobCardFormData>(initialFormData)
  const [errors, setErrors] = useState<Partial<JobCardFormData>>({})
  const [isLoading, setIsLoading] = useState(false)
  const [viewingJobCard, setViewingJobCard] = useState<JobCard | null>(null)
  const { toast } = useToast()

  const filteredJobCards = jobCards.filter((jobCard) => {
    const matchesSearch =
      jobCard.jobNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      jobCard.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      jobCard.vehicleInfo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      jobCard.problemDescription.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesStatus = !filterStatus || jobCard.status === filterStatus
    const matchesPriority = !filterPriority || jobCard.priority === filterPriority

    return matchesSearch && matchesStatus && matchesPriority
  })

  const availableVehicles = vehicles.filter((vehicle) => vehicle.customerId === formData.customerId)

  const validateForm = (): boolean => {
    const newErrors: Partial<JobCardFormData> = {}

    if (!formData.customerId) {
      newErrors.customerId = "Customer selection is required"
    }

    if (!formData.vehicleId) {
      newErrors.vehicleId = "Vehicle selection is required"
    }

    if (!formData.dateIn) {
      newErrors.dateIn = "Date in is required"
    }

    if (!formData.expectedDelivery) {
      newErrors.expectedDelivery = "Expected delivery date is required"
    } else if (formData.dateIn && new Date(formData.expectedDelivery) < new Date(formData.dateIn)) {
      newErrors.expectedDelivery = "Expected delivery must be after date in"
    }

    if (!formData.problemDescription.trim()) {
      newErrors.problemDescription = "Problem description is required"
    }

    if (!formData.assignedMechanic.trim()) {
      newErrors.assignedMechanic = "Assigned mechanic is required"
    }

    if (!formData.repairCategory) {
      newErrors.repairCategory = "Repair category is required"
    }

    if (!formData.priority) {
      newErrors.priority = "Priority is required"
    }

    if (!formData.estimatedCost.trim()) {
      newErrors.estimatedCost = "Estimated cost is required"
    } else if (isNaN(Number.parseFloat(formData.estimatedCost)) || Number.parseFloat(formData.estimatedCost) < 0) {
      newErrors.estimatedCost = "Estimated cost must be a valid positive number"
    }

    if (!formData.laborHours.trim()) {
      newErrors.laborHours = "Labor hours is required"
    } else if (isNaN(Number.parseFloat(formData.laborHours)) || Number.parseFloat(formData.laborHours) < 0) {
      newErrors.laborHours = "Labor hours must be a valid positive number"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleInputChange = (field: keyof JobCardFormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }))
    }

    // Reset vehicle selection when customer changes
    if (field === "customerId" && value !== formData.customerId) {
      setFormData((prev) => ({ ...prev, vehicleId: "" }))
    }
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

      const selectedCustomer = customers.find((c) => c.id === formData.customerId)
      const selectedVehicle = vehicles.find((v) => v.id === formData.vehicleId)

      if (editingJobCard) {
        // Update existing job card
        const updatedJobCard: JobCard = {
          ...editingJobCard,
          customerId: formData.customerId,
          customerName: selectedCustomer?.name || "",
          vehicleId: formData.vehicleId,
          vehicleInfo: selectedVehicle
            ? `${selectedVehicle.brand} ${selectedVehicle.model} ${selectedVehicle.year} (${selectedVehicle.registrationNo})`
            : "",
          dateIn: formData.dateIn,
          expectedDelivery: formData.expectedDelivery,
          problemDescription: formData.problemDescription,
          workDescription: formData.workDescription,
          assignedMechanic: formData.assignedMechanic,
          repairCategory: formData.repairCategory as JobCard["repairCategory"],
          priority: formData.priority as JobCard["priority"],
          estimatedCost: Number.parseFloat(formData.estimatedCost),
          laborHours: Number.parseFloat(formData.laborHours),
          updatedAt: new Date().toISOString(),
        }
        setJobCards((prev) => prev.map((j) => (j.id === editingJobCard.id ? updatedJobCard : j)))
        toast({
          title: "Success",
          description: "Job card has been updated successfully.",
        })
      } else {
        // Add new job card
        const newJobCard: JobCard = {
          id: `job-${Date.now()}`,
          jobNumber: `JOB-2024-${String(jobCards.length + 1).padStart(3, "0")}`,
          customerId: formData.customerId,
          customerName: selectedCustomer?.name || "",
          vehicleId: formData.vehicleId,
          vehicleInfo: selectedVehicle
            ? `${selectedVehicle.brand} ${selectedVehicle.model} ${selectedVehicle.year} (${selectedVehicle.registrationNo})`
            : "",
          dateIn: formData.dateIn,
          expectedDelivery: formData.expectedDelivery,
          problemDescription: formData.problemDescription,
          workDescription: formData.workDescription,
          assignedMechanic: formData.assignedMechanic,
          repairCategory: formData.repairCategory as JobCard["repairCategory"],
          priority: formData.priority as JobCard["priority"],
          status: "pending",
          estimatedCost: Number.parseFloat(formData.estimatedCost),
          laborHours: Number.parseFloat(formData.laborHours),
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        }
        setJobCards((prev) => [newJobCard, ...prev])
        toast({
          title: "Success",
          description: "New job card has been created successfully.",
        })
      }

      setIsDialogOpen(false)
      setEditingJobCard(null)
      setFormData(initialFormData)
      setErrors({})
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save job card. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleEdit = (jobCard: JobCard) => {
    setEditingJobCard(jobCard)
    setFormData({
      customerId: jobCard.customerId,
      vehicleId: jobCard.vehicleId,
      dateIn: jobCard.dateIn,
      expectedDelivery: jobCard.expectedDelivery,
      problemDescription: jobCard.problemDescription,
      workDescription: jobCard.workDescription,
      assignedMechanic: jobCard.assignedMechanic,
      repairCategory: jobCard.repairCategory,
      priority: jobCard.priority,
      estimatedCost: jobCard.estimatedCost.toString(),
      laborHours: jobCard.laborHours.toString(),
    })
    setIsDialogOpen(true)
  }

  const handleAddNew = () => {
    setEditingJobCard(null)
    setFormData(initialFormData)
    setErrors({})
    setIsDialogOpen(true)
  }

  const handleCancel = () => {
    setIsDialogOpen(false)
    setEditingJobCard(null)
    setFormData(initialFormData)
    setErrors({})
  }

  const handleStatusUpdate = async (jobCardId: string, newStatus: JobCard["status"]) => {
    setJobCards((prev) =>
      prev.map((job) =>
        job.id === jobCardId
          ? {
              ...job,
              status: newStatus,
              actualDelivery: newStatus === "delivered" ? new Date().toISOString().split("T")[0] : job.actualDelivery,
              updatedAt: new Date().toISOString(),
            }
          : job,
      ),
    )

    toast({
      title: "Status Updated",
      description: `Job card status has been updated to ${newStatus}.`,
    })
  }

  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800 hover:bg-yellow-100"
      case "in-progress":
        return "bg-blue-100 text-blue-800 hover:bg-blue-100"
      case "completed":
        return "bg-green-100 text-green-800 hover:bg-green-100"
      case "delivered":
        return "bg-purple-100 text-purple-800 hover:bg-purple-100"
      case "cancelled":
        return "bg-red-100 text-red-800 hover:bg-red-100"
      default:
        return "bg-gray-100 text-gray-800 hover:bg-gray-100"
    }
  }

  const getPriorityBadgeColor = (priority: string) => {
    switch (priority) {
      case "urgent":
        return "bg-red-100 text-red-800 hover:bg-red-100"
      case "high":
        return "bg-orange-100 text-orange-800 hover:bg-orange-100"
      case "medium":
        return "bg-yellow-100 text-yellow-800 hover:bg-yellow-100"
      case "low":
        return "bg-green-100 text-green-800 hover:bg-green-100"
      default:
        return "bg-gray-100 text-gray-800 hover:bg-gray-100"
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="space-y-1">
          <h2 className="text-2xl font-black text-foreground">Job Card Management</h2>
          <p className="text-muted-foreground">Stay organized with job cards</p>
        </div>

        <Button onClick={handleAddNew} className="gap-2">
          <Plus className="h-4 w-4" />
          Create Job Card
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Jobs</CardTitle>
            <ClipboardList className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{jobCards.length}</div>
            <p className="text-xs text-muted-foreground">All time</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">In Progress</CardTitle>
            <Clock className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{jobCards.filter((j) => j.status === "in-progress").length}</div>
            <p className="text-xs text-muted-foreground">Active jobs</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completed</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {jobCards.filter((j) => j.status === "completed" || j.status === "delivered").length}
            </div>
            <p className="text-xs text-muted-foreground">This month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Revenue</CardTitle>
            <Wrench className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ₹
              {jobCards
                .filter((j) => j.actualCost)
                .reduce((sum, j) => sum + (j.actualCost || 0), 0)
                .toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">Completed jobs</p>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Job Card List</CardTitle>
          <CardDescription>Manage and track all repair jobs</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-col gap-4 md:flex-row md:items-center">
            <div className="flex items-center gap-2 flex-1">
              <Search className="h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by job number, customer, vehicle, or description..."
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
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="in-progress">In Progress</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="delivered">Delivered</SelectItem>
                  <SelectItem value="cancelled">Cancelled</SelectItem>
                </SelectContent>
              </Select>

              <Select value={filterPriority} onValueChange={setFilterPriority}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="All Priority" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Priority</SelectItem>
                  <SelectItem value="urgent">Urgent</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="low">Low</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Job Cards Table */}
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Job Details</TableHead>
                  <TableHead>Customer & Vehicle</TableHead>
                  <TableHead>Dates</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Priority</TableHead>
                  <TableHead>Cost</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredJobCards.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                      {searchTerm || filterStatus || filterPriority
                        ? "No job cards found matching your filters."
                        : "No job cards found."}
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredJobCards.map((jobCard) => (
                    <TableRow key={jobCard.id}>
                      <TableCell>
                        <div className="space-y-1">
                          <p className="font-medium">{jobCard.jobNumber}</p>
                          <p className="text-sm text-muted-foreground">{jobCard.assignedMechanic}</p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          <div className="flex items-center gap-1 text-sm">
                            <User className="h-3 w-3" />
                            {jobCard.customerName}
                          </div>
                          <div className="flex items-center gap-1 text-sm">
                            <Car className="h-3 w-3" />
                            {jobCard.vehicleInfo}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          <div className="flex items-center gap-1 text-sm">
                            <Calendar className="h-3 w-3" />
                            In: {jobCard.dateIn}
                          </div>
                          <div className="flex items-center gap-1 text-sm">
                            <Clock className="h-3 w-3" />
                            Due: {jobCard.expectedDelivery}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Select
                          value={jobCard.status}
                          onValueChange={(value) => handleStatusUpdate(jobCard.id, value as JobCard["status"])}
                        >
                          <SelectTrigger className="w-32">
                            <Badge className={getStatusBadgeColor(jobCard.status)}>{jobCard.status}</Badge>
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="pending">Pending</SelectItem>
                            <SelectItem value="in-progress">In Progress</SelectItem>
                            <SelectItem value="completed">Completed</SelectItem>
                            <SelectItem value="delivered">Delivered</SelectItem>
                            <SelectItem value="cancelled">Cancelled</SelectItem>
                          </SelectContent>
                        </Select>
                      </TableCell>
                      <TableCell>
                        <Badge className={getPriorityBadgeColor(jobCard.priority)}>{jobCard.priority}</Badge>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm">
                          <p>Est: ₹{jobCard.estimatedCost.toLocaleString()}</p>
                          {jobCard.actualCost && (
                            <p className="text-muted-foreground">Act: ₹{jobCard.actualCost.toLocaleString()}</p>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setViewingJobCard(jobCard)}
                            className="h-8 w-8 p-0"
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="sm" onClick={() => handleEdit(jobCard)} className="h-8 w-8 p-0">
                            <Edit className="h-4 w-4" />
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

      {/* Add/Edit Job Card Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editingJobCard ? "Edit Job Card" : "Create New Job Card"}</DialogTitle>
            <DialogDescription>
              {editingJobCard ? "Update job card information below." : "Enter job details to create a new job card."}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-6">
            {/* Customer and Vehicle Selection */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Customer & Vehicle Information</h3>
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="customerId">Customer *</Label>
                  <Select value={formData.customerId} onValueChange={(value) => handleInputChange("customerId", value)}>
                    <SelectTrigger className={cn(errors.customerId && "border-destructive")}>
                      <SelectValue placeholder="Select customer" />
                    </SelectTrigger>
                    <SelectContent>
                      {customers.map((customer) => (
                        <SelectItem key={customer.id} value={customer.id}>
                          {customer.name} - {customer.phone}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.customerId && <p className="text-sm text-destructive">{errors.customerId}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="vehicleId">Vehicle *</Label>
                  <Select
                    value={formData.vehicleId}
                    onValueChange={(value) => handleInputChange("vehicleId", value)}
                    disabled={!formData.customerId}
                  >
                    <SelectTrigger className={cn(errors.vehicleId && "border-destructive")}>
                      <SelectValue placeholder={formData.customerId ? "Select vehicle" : "Select customer first"} />
                    </SelectTrigger>
                    <SelectContent>
                      {availableVehicles.map((vehicle) => (
                        <SelectItem key={vehicle.id} value={vehicle.id}>
                          {vehicle.registrationNo} - {vehicle.brand} {vehicle.model} ({vehicle.year})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.vehicleId && <p className="text-sm text-destructive">{errors.vehicleId}</p>}
                </div>
              </div>
            </div>

            {/* Job Details */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Job Details</h3>
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="dateIn">Date In *</Label>
                  <Input
                    id="dateIn"
                    type="date"
                    value={formData.dateIn}
                    onChange={(e) => handleInputChange("dateIn", e.target.value)}
                    className={cn(errors.dateIn && "border-destructive")}
                  />
                  {errors.dateIn && <p className="text-sm text-destructive">{errors.dateIn}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="expectedDelivery">Expected Delivery *</Label>
                  <Input
                    id="expectedDelivery"
                    type="date"
                    value={formData.expectedDelivery}
                    onChange={(e) => handleInputChange("expectedDelivery", e.target.value)}
                    className={cn(errors.expectedDelivery && "border-destructive")}
                  />
                  {errors.expectedDelivery && <p className="text-sm text-destructive">{errors.expectedDelivery}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="assignedMechanic">Assigned Mechanic *</Label>
                  <Select
                    value={formData.assignedMechanic}
                    onValueChange={(value) => handleInputChange("assignedMechanic", value)}
                  >
                    <SelectTrigger className={cn(errors.assignedMechanic && "border-destructive")}>
                      <SelectValue placeholder="Select mechanic" />
                    </SelectTrigger>
                    <SelectContent>
                      {mechanics.map((mechanic) => (
                        <SelectItem key={mechanic} value={mechanic}>
                          {mechanic}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.assignedMechanic && <p className="text-sm text-destructive">{errors.assignedMechanic}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="repairCategory">Repair Category *</Label>
                  <Select
                    value={formData.repairCategory}
                    onValueChange={(value) => handleInputChange("repairCategory", value)}
                  >
                    <SelectTrigger className={cn(errors.repairCategory && "border-destructive")}>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      {repairCategories.map((category) => (
                        <SelectItem key={category.value} value={category.value}>
                          {category.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.repairCategory && <p className="text-sm text-destructive">{errors.repairCategory}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="priority">Priority *</Label>
                  <Select value={formData.priority} onValueChange={(value) => handleInputChange("priority", value)}>
                    <SelectTrigger className={cn(errors.priority && "border-destructive")}>
                      <SelectValue placeholder="Select priority" />
                    </SelectTrigger>
                    <SelectContent>
                      {priorities.map((priority) => (
                        <SelectItem key={priority.value} value={priority.value}>
                          {priority.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.priority && <p className="text-sm text-destructive">{errors.priority}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="estimatedCost">Estimated Cost (₹) *</Label>
                  <Input
                    id="estimatedCost"
                    type="number"
                    value={formData.estimatedCost}
                    onChange={(e) => handleInputChange("estimatedCost", e.target.value)}
                    placeholder="5000"
                    min="0"
                    step="100"
                    className={cn(errors.estimatedCost && "border-destructive")}
                  />
                  {errors.estimatedCost && <p className="text-sm text-destructive">{errors.estimatedCost}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="laborHours">Labor Hours *</Label>
                  <Input
                    id="laborHours"
                    type="number"
                    value={formData.laborHours}
                    onChange={(e) => handleInputChange("laborHours", e.target.value)}
                    placeholder="4"
                    min="0"
                    step="0.5"
                    className={cn(errors.laborHours && "border-destructive")}
                  />
                  {errors.laborHours && <p className="text-sm text-destructive">{errors.laborHours}</p>}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="problemDescription">Problem Description *</Label>
                <Textarea
                  id="problemDescription"
                  value={formData.problemDescription}
                  onChange={(e) => handleInputChange("problemDescription", e.target.value)}
                  placeholder="Describe the problem reported by the customer..."
                  rows={3}
                  className={cn(errors.problemDescription && "border-destructive")}
                />
                {errors.problemDescription && <p className="text-sm text-destructive">{errors.problemDescription}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="workDescription">Work Description</Label>
                <Textarea
                  id="workDescription"
                  value={formData.workDescription}
                  onChange={(e) => handleInputChange("workDescription", e.target.value)}
                  placeholder="Describe the work to be performed or completed..."
                  rows={3}
                />
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-end gap-2 pt-4">
              <Button variant="outline" onClick={handleCancel} disabled={isLoading}>
                Cancel
              </Button>
              <Button onClick={handleSubmit} disabled={isLoading}>
                {isLoading ? "Saving..." : editingJobCard ? "Update Job Card" : "Create Job Card"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* View Job Card Dialog */}
      <Dialog open={!!viewingJobCard} onOpenChange={() => setViewingJobCard(null)}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Job Card Details</DialogTitle>
            <DialogDescription>Complete information for {viewingJobCard?.jobNumber}</DialogDescription>
          </DialogHeader>

          {viewingJobCard && (
            <div className="space-y-6">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-3">
                  <div>
                    <Label className="text-sm font-medium text-muted-foreground">Job Number</Label>
                    <p className="text-lg font-bold">{viewingJobCard.jobNumber}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-muted-foreground">Customer</Label>
                    <p className="text-sm font-medium">{viewingJobCard.customerName}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-muted-foreground">Vehicle</Label>
                    <p className="text-sm">{viewingJobCard.vehicleInfo}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-muted-foreground">Assigned Mechanic</Label>
                    <p className="text-sm">{viewingJobCard.assignedMechanic}</p>
                  </div>
                </div>

                <div className="space-y-3">
                  <div>
                    <Label className="text-sm font-medium text-muted-foreground">Status</Label>
                    <div>
                      <Badge className={getStatusBadgeColor(viewingJobCard.status)}>{viewingJobCard.status}</Badge>
                    </div>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-muted-foreground">Priority</Label>
                    <div>
                      <Badge className={getPriorityBadgeColor(viewingJobCard.priority)}>
                        {viewingJobCard.priority}
                      </Badge>
                    </div>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-muted-foreground">Category</Label>
                    <p className="text-sm capitalize">{viewingJobCard.repairCategory}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-muted-foreground">Labor Hours</Label>
                    <p className="text-sm">{viewingJobCard.laborHours} hours</p>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <div>
                  <Label className="text-sm font-medium text-muted-foreground">Problem Description</Label>
                  <p className="text-sm bg-muted p-3 rounded-lg">{viewingJobCard.problemDescription}</p>
                </div>
                {viewingJobCard.workDescription && (
                  <div>
                    <Label className="text-sm font-medium text-muted-foreground">Work Description</Label>
                    <p className="text-sm bg-muted p-3 rounded-lg">{viewingJobCard.workDescription}</p>
                  </div>
                )}
              </div>

              <div className="grid gap-4 md:grid-cols-4">
                <div className="text-center p-4 bg-muted rounded-lg">
                  <p className="text-sm font-medium">{viewingJobCard.dateIn}</p>
                  <p className="text-sm text-muted-foreground">Date In</p>
                </div>
                <div className="text-center p-4 bg-muted rounded-lg">
                  <p className="text-sm font-medium">{viewingJobCard.expectedDelivery}</p>
                  <p className="text-sm text-muted-foreground">Expected Delivery</p>
                </div>
                <div className="text-center p-4 bg-muted rounded-lg">
                  <p className="text-lg font-bold">₹{viewingJobCard.estimatedCost.toLocaleString()}</p>
                  <p className="text-sm text-muted-foreground">Estimated Cost</p>
                </div>
                <div className="text-center p-4 bg-muted rounded-lg">
                  <p className="text-lg font-bold">
                    {viewingJobCard.actualCost ? `₹${viewingJobCard.actualCost.toLocaleString()}` : "TBD"}
                  </p>
                  <p className="text-sm text-muted-foreground">Actual Cost</p>
                </div>
              </div>

              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setViewingJobCard(null)}>
                  Close
                </Button>
                <Button
                  onClick={() => {
                    setViewingJobCard(null)
                    handleEdit(viewingJobCard)
                  }}
                >
                  Edit Job Card
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
