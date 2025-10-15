import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/src/components/ui/card"
import { Button } from "@/src/components/ui/button"
import { Input } from "@/src/components/ui/input"
import { Label } from "@/src/components/ui/label"
import { Badge } from "@/src/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/src/components/ui/select"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/src/components/ui/dialog"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/src/components/ui/table"
import { useToast } from "@/src/hooks/use-toast"
import { Car, Plus, Search, Edit, Eye, User, Calendar, Hash } from "lucide-react"
import { cn } from "@/src/lib/utils"

interface Vehicle {
  id: string
  registrationNo: string
  brand: string
  model: string
  year: number
  vin: string
  color: string
  fuelType: "petrol" | "diesel" | "electric" | "hybrid"
  customerId: string
  customerName: string
  mileage: number
  lastService: string
  totalJobs: number
  status: "active" | "inactive"
  createdAt: string
}

interface Customer {
  id: string
  name: string
  email: string
  phone: string
}

const mockCustomers: Customer[] = [
  { id: "cust-001", name: "John Smith", email: "john.smith@email.com", phone: "+91 98765 43210" },
  { id: "cust-002", name: "Sarah Johnson", email: "sarah.j@email.com", phone: "+91 87654 32109" },
  { id: "cust-003", name: "Michael Brown", email: "m.brown@email.com", phone: "+91 76543 21098" },
]

const mockVehicles: Vehicle[] = [
  {
    id: "veh-001",
    registrationNo: "MH01AB1234",
    brand: "Honda",
    model: "Civic",
    year: 2020,
    vin: "1HGBH41JXMN109186",
    color: "White",
    fuelType: "petrol",
    customerId: "cust-001",
    customerName: "John Smith",
    mileage: 45000,
    lastService: "2024-01-10",
    totalJobs: 5,
    status: "active",
    createdAt: "2023-06-15",
  },
  {
    id: "veh-002",
    registrationNo: "DL02CD5678",
    brand: "Toyota",
    model: "Camry",
    year: 2019,
    vin: "4T1BF1FK5KU123456",
    color: "Silver",
    fuelType: "hybrid",
    customerId: "cust-002",
    customerName: "Sarah Johnson",
    mileage: 38000,
    lastService: "2024-01-05",
    totalJobs: 3,
    status: "active",
    createdAt: "2023-08-22",
  },
  {
    id: "veh-003",
    registrationNo: "KA03EF9012",
    brand: "BMW",
    model: "X5",
    year: 2021,
    vin: "5UXCR6C0XL9123456",
    color: "Black",
    fuelType: "diesel",
    customerId: "cust-003",
    customerName: "Michael Brown",
    mileage: 25000,
    lastService: "2023-12-20",
    totalJobs: 8,
    status: "active",
    createdAt: "2023-03-10",
  },
]

interface VehicleFormData {
  registrationNo: string
  brand: string
  model: string
  year: string
  vin: string
  color: string
  fuelType: "petrol" | "diesel" | "electric" | "hybrid" | ""
  customerId: string
  mileage: string
}

const initialFormData: VehicleFormData = {
  registrationNo: "",
  brand: "",
  model: "",
  year: "",
  vin: "",
  color: "",
  fuelType: "",
  customerId: "",
  mileage: "",
}

const fuelTypeOptions = [
  { value: "petrol", label: "Petrol" },
  { value: "diesel", label: "Diesel" },
  { value: "electric", label: "Electric" },
  { value: "hybrid", label: "Hybrid" },
]

const popularBrands = [
  "Honda",
  "Toyota",
  "Maruti Suzuki",
  "Hyundai",
  "Mahindra",
  "Tata",
  "BMW",
  "Mercedes-Benz",
  "Audi",
  "Volkswagen",
  "Ford",
  "Chevrolet",
  "Nissan",
  "Kia",
  "Skoda",
  "Renault",
]

export function VehicleManagement() {
  const [vehicles, setVehicles] = useState<Vehicle[]>(mockVehicles)
  const [customers] = useState<Customer[]>(mockCustomers)
  const [searchTerm, setSearchTerm] = useState("")
  const [filterBrand, setFilterBrand] = useState("")
  const [filterFuelType, setFilterFuelType] = useState("")
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingVehicle, setEditingVehicle] = useState<Vehicle | null>(null)
  const [formData, setFormData] = useState<VehicleFormData>(initialFormData)
  const [errors, setErrors] = useState<Partial<VehicleFormData>>({})
  const [isLoading, setIsLoading] = useState(false)
  const [viewingVehicle, setViewingVehicle] = useState<Vehicle | null>(null)
  const { toast } = useToast()

  const filteredVehicles = vehicles.filter((vehicle) => {
    const matchesSearch =
      vehicle.registrationNo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      vehicle.brand.toLowerCase().includes(searchTerm.toLowerCase()) ||
      vehicle.model.toLowerCase().includes(searchTerm.toLowerCase()) ||
      vehicle.customerName.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesBrand = !filterBrand || vehicle.brand === filterBrand
    const matchesFuelType = !filterFuelType || vehicle.fuelType === filterFuelType

    return matchesSearch && matchesBrand && matchesFuelType
  })

  const validateForm = (): boolean => {
    const newErrors: Partial<VehicleFormData> = {}

    if (!formData.registrationNo.trim()) {
      newErrors.registrationNo = "Registration number is required"
    } else if (!/^[A-Z]{2}[0-9]{2}[A-Z]{1,2}[0-9]{4}$/.test(formData.registrationNo.replace(/\s/g, ""))) {
      newErrors.registrationNo = "Invalid registration number format (e.g., MH01AB1234)"
    }

    if (!formData.brand.trim()) {
      newErrors.brand = "Brand is required"
    }

    if (!formData.model.trim()) {
      newErrors.model = "Model is required"
    }

    if (!formData.year.trim()) {
      newErrors.year = "Year is required"
    } else {
      const year = Number.parseInt(formData.year)
      const currentYear = new Date().getFullYear()
      if (isNaN(year) || year < 1900 || year > currentYear + 1) {
        newErrors.year = `Year must be between 1900 and ${currentYear + 1}`
      }
    }

    if (!formData.vin.trim()) {
      newErrors.vin = "VIN is required"
    } else if (formData.vin.length !== 17) {
      newErrors.vin = "VIN must be exactly 17 characters"
    }

    if (!formData.color.trim()) {
      newErrors.color = "Color is required"
    }

    if (!formData.fuelType) {
      newErrors.fuelType = "Fuel type is required"
    }

    if (!formData.customerId) {
      newErrors.customerId = "Customer selection is required"
    }

    if (!formData.mileage.trim()) {
      newErrors.mileage = "Mileage is required"
    } else if (isNaN(Number.parseInt(formData.mileage)) || Number.parseInt(formData.mileage) < 0) {
      newErrors.mileage = "Mileage must be a valid positive number"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleInputChange = (field: keyof VehicleFormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }))
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

      if (editingVehicle) {
        // Update existing vehicle
        const updatedVehicle: Vehicle = {
          ...editingVehicle,
          registrationNo: formData.registrationNo.toUpperCase(),
          brand: formData.brand,
          model: formData.model,
          year: Number.parseInt(formData.year),
          vin: formData.vin.toUpperCase(),
          color: formData.color,
          fuelType: formData.fuelType as Vehicle["fuelType"],
          customerId: formData.customerId,
          customerName: selectedCustomer?.name || "",
          mileage: Number.parseInt(formData.mileage),
        }
        setVehicles((prev) => prev.map((v) => (v.id === editingVehicle.id ? updatedVehicle : v)))
        toast({
          title: "Success",
          description: "Vehicle information has been updated successfully.",
        })
      } else {
        // Add new vehicle
        const newVehicle: Vehicle = {
          id: `veh-${Date.now()}`,
          registrationNo: formData.registrationNo.toUpperCase(),
          brand: formData.brand,
          model: formData.model,
          year: Number.parseInt(formData.year),
          vin: formData.vin.toUpperCase(),
          color: formData.color,
          fuelType: formData.fuelType as Vehicle["fuelType"],
          customerId: formData.customerId,
          customerName: selectedCustomer?.name || "",
          mileage: Number.parseInt(formData.mileage),
          lastService: "",
          totalJobs: 0,
          status: "active",
          createdAt: new Date().toISOString().split("T")[0],
        }
        setVehicles((prev) => [newVehicle, ...prev])
        toast({
          title: "Success",
          description: "New vehicle has been added successfully.",
        })
      }

      setIsDialogOpen(false)
      setEditingVehicle(null)
      setFormData(initialFormData)
      setErrors({})
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save vehicle information. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleEdit = (vehicle: Vehicle) => {
    setEditingVehicle(vehicle)
    setFormData({
      registrationNo: vehicle.registrationNo,
      brand: vehicle.brand,
      model: vehicle.model,
      year: vehicle.year.toString(),
      vin: vehicle.vin,
      color: vehicle.color,
      fuelType: vehicle.fuelType,
      customerId: vehicle.customerId,
      mileage: vehicle.mileage.toString(),
    })
    setIsDialogOpen(true)
  }

  const handleAddNew = () => {
    setEditingVehicle(null)
    setFormData(initialFormData)
    setErrors({})
    setIsDialogOpen(true)
  }

  const handleCancel = () => {
    setIsDialogOpen(false)
    setEditingVehicle(null)
    setFormData(initialFormData)
    setErrors({})
  }

  const getFuelTypeBadgeColor = (fuelType: string) => {
    switch (fuelType) {
      case "electric":
        return "bg-green-100 text-green-800 hover:bg-green-100"
      case "hybrid":
        return "bg-blue-100 text-blue-800 hover:bg-blue-100"
      case "diesel":
        return "bg-orange-100 text-orange-800 hover:bg-orange-100"
      default:
        return "bg-gray-100 text-gray-800 hover:bg-gray-100"
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="space-y-1">
          <h2 className="text-2xl font-black text-foreground">Vehicle Management</h2>
          <p className="text-muted-foreground">Track every vehicle with precision</p>
        </div>

        <Button onClick={handleAddNew} className="gap-2">
          <Plus className="h-4 w-4" />
          Add New Vehicle
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Vehicles</CardTitle>
            <Car className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{vehicles.length}</div>
            <p className="text-xs text-muted-foreground">
              {vehicles.filter((v) => v.status === "active").length} active
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Electric/Hybrid</CardTitle>
            <Car className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {vehicles.filter((v) => v.fuelType === "electric" || v.fuelType === "hybrid").length}
            </div>
            <p className="text-xs text-muted-foreground">Eco-friendly vehicles</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Jobs</CardTitle>
            <Hash className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{vehicles.reduce((sum, v) => sum + v.totalJobs, 0)}</div>
            <p className="text-xs text-muted-foreground">Across all vehicles</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg. Year</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {vehicles.length > 0 ? Math.round(vehicles.reduce((sum, v) => sum + v.year, 0) / vehicles.length) : 0}
            </div>
            <p className="text-xs text-muted-foreground">Average vehicle year</p>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Vehicle List</CardTitle>
          <CardDescription>Search and manage your vehicle database</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-col gap-4 md:flex-row md:items-center">
            <div className="flex items-center gap-2 flex-1">
              <Search className="h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by registration, brand, model, or customer..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="max-w-sm"
              />
            </div>

            <div className="flex gap-2">
              <Select value={filterBrand} onValueChange={setFilterBrand}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="All Brands" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Brands</SelectItem>
                  {Array.from(new Set(vehicles.map((v) => v.brand))).map((brand) => (
                    <SelectItem key={brand} value={brand}>
                      {brand}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={filterFuelType} onValueChange={setFilterFuelType}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="All Fuel Types" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Fuel Types</SelectItem>
                  {fuelTypeOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Vehicle Table */}
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Vehicle</TableHead>
                  <TableHead>Customer</TableHead>
                  <TableHead>Details</TableHead>
                  <TableHead>Fuel Type</TableHead>
                  <TableHead>Mileage</TableHead>
                  <TableHead>Jobs</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredVehicles.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                      {searchTerm || filterBrand || filterFuelType
                        ? "No vehicles found matching your filters."
                        : "No vehicles found."}
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredVehicles.map((vehicle) => (
                    <TableRow key={vehicle.id}>
                      <TableCell>
                        <div className="space-y-1">
                          <p className="font-medium">{vehicle.registrationNo}</p>
                          <p className="text-sm text-muted-foreground">
                            {vehicle.brand} {vehicle.model} ({vehicle.year})
                          </p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1 text-sm">
                          <User className="h-3 w-3" />
                          {vehicle.customerName}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          <p className="text-sm">Color: {vehicle.color}</p>
                          <p className="text-xs text-muted-foreground">VIN: {vehicle.vin.slice(-6)}</p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge className={getFuelTypeBadgeColor(vehicle.fuelType)}>{vehicle.fuelType}</Badge>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm">{vehicle.mileage.toLocaleString()} km</div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="secondary">{vehicle.totalJobs}</Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setViewingVehicle(vehicle)}
                            className="h-8 w-8 p-0"
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="sm" onClick={() => handleEdit(vehicle)} className="h-8 w-8 p-0">
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

      {/* Add/Edit Vehicle Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editingVehicle ? "Edit Vehicle" : "Add New Vehicle"}</DialogTitle>
            <DialogDescription>
              {editingVehicle
                ? "Update vehicle information below."
                : "Enter vehicle details to add it to your database."}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-6">
            {/* Vehicle Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Vehicle Information</h3>
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="registrationNo">Registration Number *</Label>
                  <Input
                    id="registrationNo"
                    value={formData.registrationNo}
                    onChange={(e) => handleInputChange("registrationNo", e.target.value.toUpperCase())}
                    placeholder="MH01AB1234"
                    className={cn(errors.registrationNo && "border-destructive")}
                  />
                  {errors.registrationNo && <p className="text-sm text-destructive">{errors.registrationNo}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="customerId">Customer *</Label>
                  <Select value={formData.customerId} onValueChange={(value) => handleInputChange("customerId", value)}>
                    <SelectTrigger className={cn(errors.customerId && "border-destructive")}>
                      <SelectValue placeholder="Select customer" />
                    </SelectTrigger>
                    <SelectContent>
                      {customers.map((customer) => (
                        <SelectItem key={customer.id} value={customer.id}>
                          {customer.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.customerId && <p className="text-sm text-destructive">{errors.customerId}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="brand">Brand *</Label>
                  <Input
                    id="brand"
                    value={formData.brand}
                    onChange={(e) => handleInputChange("brand", e.target.value)}
                    placeholder="Honda"
                    className={cn(errors.brand && "border-destructive")}
                    list="brands"
                  />
                  <datalist id="brands">
                    {popularBrands.map((brand) => (
                      <option key={brand} value={brand} />
                    ))}
                  </datalist>
                  {errors.brand && <p className="text-sm text-destructive">{errors.brand}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="model">Model *</Label>
                  <Input
                    id="model"
                    value={formData.model}
                    onChange={(e) => handleInputChange("model", e.target.value)}
                    placeholder="Civic"
                    className={cn(errors.model && "border-destructive")}
                  />
                  {errors.model && <p className="text-sm text-destructive">{errors.model}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="year">Year *</Label>
                  <Input
                    id="year"
                    type="number"
                    value={formData.year}
                    onChange={(e) => handleInputChange("year", e.target.value)}
                    placeholder="2020"
                    min="1900"
                    max={new Date().getFullYear() + 1}
                    className={cn(errors.year && "border-destructive")}
                  />
                  {errors.year && <p className="text-sm text-destructive">{errors.year}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="color">Color *</Label>
                  <Input
                    id="color"
                    value={formData.color}
                    onChange={(e) => handleInputChange("color", e.target.value)}
                    placeholder="White"
                    className={cn(errors.color && "border-destructive")}
                  />
                  {errors.color && <p className="text-sm text-destructive">{errors.color}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="fuelType">Fuel Type *</Label>
                  <Select value={formData.fuelType} onValueChange={(value) => handleInputChange("fuelType", value)}>
                    <SelectTrigger className={cn(errors.fuelType && "border-destructive")}>
                      <SelectValue placeholder="Select fuel type" />
                    </SelectTrigger>
                    <SelectContent>
                      {fuelTypeOptions.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.fuelType && <p className="text-sm text-destructive">{errors.fuelType}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="mileage">Current Mileage (km) *</Label>
                  <Input
                    id="mileage"
                    type="number"
                    value={formData.mileage}
                    onChange={(e) => handleInputChange("mileage", e.target.value)}
                    placeholder="45000"
                    min="0"
                    className={cn(errors.mileage && "border-destructive")}
                  />
                  {errors.mileage && <p className="text-sm text-destructive">{errors.mileage}</p>}
                </div>

                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="vin">VIN (Vehicle Identification Number) *</Label>
                  <Input
                    id="vin"
                    value={formData.vin}
                    onChange={(e) => handleInputChange("vin", e.target.value.toUpperCase())}
                    placeholder="1HGBH41JXMN109186"
                    maxLength={17}
                    className={cn(errors.vin && "border-destructive")}
                  />
                  {errors.vin && <p className="text-sm text-destructive">{errors.vin}</p>}
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-end gap-2 pt-4">
              <Button variant="outline" onClick={handleCancel} disabled={isLoading}>
                Cancel
              </Button>
              <Button onClick={handleSubmit} disabled={isLoading}>
                {isLoading ? "Saving..." : editingVehicle ? "Update Vehicle" : "Add Vehicle"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* View Vehicle Dialog */}
      <Dialog open={!!viewingVehicle} onOpenChange={() => setViewingVehicle(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Vehicle Details</DialogTitle>
            <DialogDescription>Complete information for {viewingVehicle?.registrationNo}</DialogDescription>
          </DialogHeader>

          {viewingVehicle && (
            <div className="space-y-6">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-3">
                  <div>
                    <Label className="text-sm font-medium text-muted-foreground">Registration Number</Label>
                    <p className="text-lg font-bold">{viewingVehicle.registrationNo}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-muted-foreground">Vehicle</Label>
                    <p className="text-sm font-medium">
                      {viewingVehicle.brand} {viewingVehicle.model} ({viewingVehicle.year})
                    </p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-muted-foreground">Color</Label>
                    <p className="text-sm">{viewingVehicle.color}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-muted-foreground">Fuel Type</Label>
                    <div>
                      <Badge className={getFuelTypeBadgeColor(viewingVehicle.fuelType)}>
                        {viewingVehicle.fuelType}
                      </Badge>
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <div>
                    <Label className="text-sm font-medium text-muted-foreground">Owner</Label>
                    <p className="text-sm font-medium">{viewingVehicle.customerName}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-muted-foreground">Current Mileage</Label>
                    <p className="text-sm">{viewingVehicle.mileage.toLocaleString()} km</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-muted-foreground">VIN</Label>
                    <p className="text-sm font-mono">{viewingVehicle.vin}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-muted-foreground">Status</Label>
                    <div>
                      <Badge variant={viewingVehicle.status === "active" ? "default" : "secondary"}>
                        {viewingVehicle.status}
                      </Badge>
                    </div>
                  </div>
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-3">
                <div className="text-center p-4 bg-muted rounded-lg">
                  <p className="text-2xl font-bold">{viewingVehicle.totalJobs}</p>
                  <p className="text-sm text-muted-foreground">Total Jobs</p>
                </div>
                <div className="text-center p-4 bg-muted rounded-lg">
                  <p className="text-sm font-medium">{viewingVehicle.lastService || "Never"}</p>
                  <p className="text-sm text-muted-foreground">Last Service</p>
                </div>
                <div className="text-center p-4 bg-muted rounded-lg">
                  <p className="text-sm font-medium">{viewingVehicle.createdAt}</p>
                  <p className="text-sm text-muted-foreground">Added On</p>
                </div>
              </div>

              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setViewingVehicle(null)}>
                  Close
                </Button>
                <Button
                  onClick={() => {
                    setViewingVehicle(null)
                    handleEdit(viewingVehicle)
                  }}
                >
                  Edit Vehicle
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
