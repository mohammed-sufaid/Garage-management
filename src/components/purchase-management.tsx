import { useState } from "react"
import { Button } from "@/src/components/ui/button"
import { Input } from "@/src/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/src/components/ui/card"
import { Badge } from "@/src/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/src/components/ui/dialog"
import { Label } from "@/src/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/src/components/ui/select"
import { Textarea } from "@/src/components/ui/textarea"
import { toast } from "@/src/hooks/use-toast"
import { Search, Plus, Edit, Eye, ShoppingCart, Package, DollarSign, Calendar } from "lucide-react"

interface PurchaseItem {
  id: string
  name: string
  quantity: number
  unitPrice: number
  total: number
}

interface Purchase {
  id: string
  orderNumber: string
  supplier: string
  supplierContact: string
  orderDate: string
  expectedDate: string
  receivedDate?: string
  status: "pending" | "ordered" | "received" | "paid"
  items: PurchaseItem[]
  subtotal: number
  tax: number
  total: number
  notes: string
}

const mockPurchases: Purchase[] = [
  {
    id: "1",
    orderNumber: "PO-2024-001",
    supplier: "AutoParts Plus",
    supplierContact: "contact@autopartsplus.com",
    orderDate: "2024-01-15",
    expectedDate: "2024-01-20",
    receivedDate: "2024-01-19",
    status: "received",
    items: [
      { id: "1", name: "Engine Oil Filter", quantity: 10, unitPrice: 12.5, total: 125.0 },
      { id: "2", name: "Brake Pads Set", quantity: 5, unitPrice: 45.0, total: 225.0 },
    ],
    subtotal: 350.0,
    tax: 28.0,
    total: 378.0,
    notes: "Regular monthly stock replenishment",
  },
  {
    id: "2",
    orderNumber: "PO-2024-002",
    supplier: "Tire World",
    supplierContact: "orders@tireworld.com",
    orderDate: "2024-01-18",
    expectedDate: "2024-01-25",
    status: "ordered",
    items: [
      { id: "3", name: "All-Season Tires 205/55R16", quantity: 4, unitPrice: 85.0, total: 340.0 },
      { id: "4", name: "Tire Mounting Kit", quantity: 1, unitPrice: 25.0, total: 25.0 },
    ],
    subtotal: 365.0,
    tax: 29.2,
    total: 394.2,
    notes: "Customer special order - Honda Civic",
  },
  {
    id: "3",
    orderNumber: "PO-2024-003",
    supplier: "Tool Supply Co",
    supplierContact: "sales@toolsupply.com",
    orderDate: "2024-01-20",
    expectedDate: "2024-01-27",
    status: "pending",
    items: [
      { id: "5", name: "Socket Wrench Set", quantity: 2, unitPrice: 75.0, total: 150.0 },
      { id: "6", name: "Diagnostic Scanner", quantity: 1, unitPrice: 450.0, total: 450.0 },
    ],
    subtotal: 600.0,
    tax: 48.0,
    total: 648.0,
    notes: "New equipment for diagnostic bay",
  },
]

const suppliers = [
  "AutoParts Plus",
  "Tire World",
  "Tool Supply Co",
  "Battery Depot",
  "Fluid Systems Inc",
  "Electrical Components Ltd",
]

const statusColors = {
  pending: "bg-yellow-100 text-yellow-800",
  ordered: "bg-blue-100 text-blue-800",
  received: "bg-green-100 text-green-800",
  paid: "bg-gray-100 text-gray-800",
}

export function PurchaseManagement() {
  const [purchases, setPurchases] = useState<Purchase[]>(mockPurchases)
  const [searchTerm, setSearchTerm] = useState("")
  const [filterSupplier, setFilterSupplier] = useState<string>("all")
  const [filterStatus, setFilterStatus] = useState<string>("all")
  const [selectedPurchase, setSelectedPurchase] = useState<Purchase | null>(null)
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false)
  const [formData, setFormData] = useState<Partial<Purchase>>({})
  const [formItems, setFormItems] = useState<PurchaseItem[]>([])

  const filteredPurchases = purchases.filter((purchase) => {
    const matchesSearch =
      purchase.orderNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      purchase.supplier.toLowerCase().includes(searchTerm.toLowerCase()) ||
      purchase.items.some((item) => item.name.toLowerCase().includes(searchTerm.toLowerCase()))
    const matchesSupplier = filterSupplier === "all" || purchase.supplier === filterSupplier
    const matchesStatus = filterStatus === "all" || purchase.status === filterStatus

    return matchesSearch && matchesSupplier && matchesStatus
  })

  const totalPurchases = purchases.length
  const pendingOrders = purchases.filter((p) => p.status === "pending" || p.status === "ordered").length
  const totalValue = purchases.reduce((sum, purchase) => sum + purchase.total, 0)
  const monthlySpend = purchases
    .filter((p) => new Date(p.orderDate).getMonth() === new Date().getMonth())
    .reduce((sum, purchase) => sum + purchase.total, 0)

  const calculateTotals = (items: PurchaseItem[]) => {
    const subtotal = items.reduce((sum, item) => sum + item.total, 0)
    const tax = subtotal * 0.08 // 8% tax
    const total = subtotal + tax
    return { subtotal, tax, total }
  }

  const handleAddItem = () => {
    const newItem: PurchaseItem = {
      id: Date.now().toString(),
      name: "",
      quantity: 1,
      unitPrice: 0,
      total: 0,
    }
    setFormItems([...formItems, newItem])
  }

  const handleUpdateItem = (index: number, field: keyof PurchaseItem, value: string | number) => {
    const updatedItems = [...formItems]
    updatedItems[index] = { ...updatedItems[index], [field]: value }

    if (field === "quantity" || field === "unitPrice") {
      updatedItems[index].total = updatedItems[index].quantity * updatedItems[index].unitPrice
    }

    setFormItems(updatedItems)
  }

  const handleRemoveItem = (index: number) => {
    setFormItems(formItems.filter((_, i) => i !== index))
  }

  const handleAddPurchase = () => {
    if (!formData.supplier || !formData.orderDate || !formData.expectedDate || formItems.length === 0) {
      toast({
        title: "Error",
        description: "Please fill in all required fields and add at least one item.",
        variant: "destructive",
      })
      return
    }

    const { subtotal, tax, total } = calculateTotals(formItems)
    const orderNumber = `PO-${new Date().getFullYear()}-${String(purchases.length + 1).padStart(3, "0")}`

    const newPurchase: Purchase = {
      id: Date.now().toString(),
      orderNumber,
      supplier: formData.supplier!,
      supplierContact: formData.supplierContact || "",
      orderDate: formData.orderDate!,
      expectedDate: formData.expectedDate!,
      status: "pending",
      items: formItems,
      subtotal,
      tax,
      total,
      notes: formData.notes || "",
    }

    setPurchases([...purchases, newPurchase])
    setFormData({})
    setFormItems([])
    setIsAddDialogOpen(false)
    toast({
      title: "Success",
      description: "Purchase order created successfully.",
    })
  }

  const handleEditPurchase = () => {
    if (
      !selectedPurchase ||
      !formData.supplier ||
      !formData.orderDate ||
      !formData.expectedDate ||
      formItems.length === 0
    ) {
      toast({
        title: "Error",
        description: "Please fill in all required fields and add at least one item.",
        variant: "destructive",
      })
      return
    }

    const { subtotal, tax, total } = calculateTotals(formItems)

    const updatedPurchases = purchases.map((purchase) =>
      purchase.id === selectedPurchase.id
        ? { ...purchase, ...formData, items: formItems, subtotal, tax, total }
        : purchase,
    )

    setPurchases(updatedPurchases)
    setFormData({})
    setFormItems([])
    setSelectedPurchase(null)
    setIsEditDialogOpen(false)
    toast({
      title: "Success",
      description: "Purchase order updated successfully.",
    })
  }

  const handleStatusUpdate = (purchase: Purchase, newStatus: Purchase["status"]) => {
    const updatedPurchases = purchases.map((p) =>
      p.id === purchase.id
        ? {
            ...p,
            status: newStatus,
            receivedDate: newStatus === "received" ? new Date().toISOString().split("T")[0] : p.receivedDate,
          }
        : p,
    )
    setPurchases(updatedPurchases)
    toast({
      title: "Success",
      description: `Purchase order status updated to ${newStatus}.`,
    })
  }

  const openEditDialog = (purchase: Purchase) => {
    setSelectedPurchase(purchase)
    setFormData(purchase)
    setFormItems(purchase.items)
    setIsEditDialogOpen(true)
  }

  const openViewDialog = (purchase: Purchase) => {
    setSelectedPurchase(purchase)
    setIsViewDialogOpen(true)
  }

  const openAddDialog = () => {
    setFormData({})
    setFormItems([])
    setIsAddDialogOpen(true)
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Purchase Management</h1>
          <p className="text-gray-600">Manage purchase orders, suppliers, and inventory procurement</p>
        </div>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={openAddDialog} className="bg-orange-600 hover:bg-orange-700">
              <Plus className="h-4 w-4 mr-2" />
              New Purchase Order
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Create Purchase Order</DialogTitle>
              <DialogDescription>Enter the purchase order details and items below.</DialogDescription>
            </DialogHeader>
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="supplier">Supplier *</Label>
                  <Select
                    value={formData.supplier || ""}
                    onValueChange={(value) => setFormData({ ...formData, supplier: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select supplier" />
                    </SelectTrigger>
                    <SelectContent>
                      {suppliers.map((supplier) => (
                        <SelectItem key={supplier} value={supplier}>
                          {supplier}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="supplierContact">Supplier Contact</Label>
                  <Input
                    id="supplierContact"
                    value={formData.supplierContact || ""}
                    onChange={(e) => setFormData({ ...formData, supplierContact: e.target.value })}
                    placeholder="Enter supplier contact"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="orderDate">Order Date *</Label>
                  <Input
                    id="orderDate"
                    type="date"
                    value={formData.orderDate || ""}
                    onChange={(e) => setFormData({ ...formData, orderDate: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="expectedDate">Expected Delivery *</Label>
                  <Input
                    id="expectedDate"
                    type="date"
                    value={formData.expectedDate || ""}
                    onChange={(e) => setFormData({ ...formData, expectedDate: e.target.value })}
                  />
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label className="text-lg font-medium">Items</Label>
                  <Button type="button" onClick={handleAddItem} variant="outline" size="sm">
                    <Plus className="h-4 w-4 mr-2" />
                    Add Item
                  </Button>
                </div>

                {formItems.map((item, index) => (
                  <div key={item.id} className="grid grid-cols-1 md:grid-cols-5 gap-4 p-4 border rounded-lg">
                    <div className="md:col-span-2">
                      <Label htmlFor={`item-name-${index}`}>Item Name</Label>
                      <Input
                        id={`item-name-${index}`}
                        value={item.name}
                        onChange={(e) => handleUpdateItem(index, "name", e.target.value)}
                        placeholder="Enter item name"
                      />
                    </div>
                    <div>
                      <Label htmlFor={`item-quantity-${index}`}>Quantity</Label>
                      <Input
                        id={`item-quantity-${index}`}
                        type="number"
                        value={item.quantity}
                        onChange={(e) => handleUpdateItem(index, "quantity", Number(e.target.value))}
                        min="1"
                      />
                    </div>
                    <div>
                      <Label htmlFor={`item-price-${index}`}>Unit Price</Label>
                      <Input
                        id={`item-price-${index}`}
                        type="number"
                        step="0.01"
                        value={item.unitPrice}
                        onChange={(e) => handleUpdateItem(index, "unitPrice", Number(e.target.value))}
                        min="0"
                      />
                    </div>
                    <div className="flex items-end gap-2">
                      <div className="flex-1">
                        <Label>Total</Label>
                        <div className="text-lg font-medium">${item.total.toFixed(2)}</div>
                      </div>
                      <Button type="button" variant="destructive" size="sm" onClick={() => handleRemoveItem(index)}>
                        Remove
                      </Button>
                    </div>
                  </div>
                ))}

                {formItems.length > 0 && (
                  <div className="border-t pt-4">
                    <div className="flex justify-end space-y-2">
                      <div className="text-right">
                        <div>Subtotal: ${calculateTotals(formItems).subtotal.toFixed(2)}</div>
                        <div>Tax (8%): ${calculateTotals(formItems).tax.toFixed(2)}</div>
                        <div className="text-lg font-bold">Total: ${calculateTotals(formItems).total.toFixed(2)}</div>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="notes">Notes</Label>
                <Textarea
                  id="notes"
                  value={formData.notes || ""}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  placeholder="Enter any additional notes"
                  rows={3}
                />
              </div>
            </div>
            <div className="flex justify-end gap-2 pt-4">
              <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleAddPurchase} className="bg-orange-600 hover:bg-orange-700">
                Create Purchase Order
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
            <ShoppingCart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalPurchases}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Orders</CardTitle>
            <Package className="h-4 w-4 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">{pendingOrders}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Value</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${totalValue.toLocaleString()}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Monthly Spend</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${monthlySpend.toLocaleString()}</div>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Search & Filter</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="relative md:col-span-2">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search orders, suppliers, or items..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={filterSupplier} onValueChange={setFilterSupplier}>
              <SelectTrigger>
                <SelectValue placeholder="Filter by supplier" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Suppliers</SelectItem>
                {suppliers.map((supplier) => (
                  <SelectItem key={supplier} value={supplier}>
                    {supplier}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger>
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="ordered">Ordered</SelectItem>
                <SelectItem value="received">Received</SelectItem>
                <SelectItem value="paid">Paid</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Purchase Orders List */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredPurchases.map((purchase) => (
          <Card key={purchase.id} className="hover:shadow-md transition-shadow">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="text-lg">{purchase.orderNumber}</CardTitle>
                  <CardDescription>{purchase.supplier}</CardDescription>
                </div>
                <Badge className={statusColors[purchase.status]}>{purchase.status}</Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 text-sm">
                <div>
                  <strong>Order Date:</strong> {new Date(purchase.orderDate).toLocaleDateString()}
                </div>
                <div>
                  <strong>Expected:</strong> {new Date(purchase.expectedDate).toLocaleDateString()}
                </div>
                {purchase.receivedDate && (
                  <div>
                    <strong>Received:</strong> {new Date(purchase.receivedDate).toLocaleDateString()}
                  </div>
                )}
                <div>
                  <strong>Items:</strong> {purchase.items.length} item(s)
                </div>
                <div>
                  <strong>Total:</strong> ${purchase.total.toFixed(2)}
                </div>
                {purchase.notes && (
                  <div>
                    <strong>Notes:</strong> {purchase.notes}
                  </div>
                )}
              </div>
              <div className="flex gap-2 mt-4">
                <Button variant="outline" size="sm" onClick={() => openViewDialog(purchase)}>
                  <Eye className="h-4 w-4 mr-1" />
                  View
                </Button>
                <Button variant="outline" size="sm" onClick={() => openEditDialog(purchase)}>
                  <Edit className="h-4 w-4 mr-1" />
                  Edit
                </Button>
                {purchase.status === "pending" && (
                  <Button variant="default" size="sm" onClick={() => handleStatusUpdate(purchase, "ordered")}>
                    Mark Ordered
                  </Button>
                )}
                {purchase.status === "ordered" && (
                  <Button variant="default" size="sm" onClick={() => handleStatusUpdate(purchase, "received")}>
                    Mark Received
                  </Button>
                )}
                {purchase.status === "received" && (
                  <Button variant="default" size="sm" onClick={() => handleStatusUpdate(purchase, "paid")}>
                    Mark Paid
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredPurchases.length === 0 && (
        <Card>
          <CardContent className="text-center py-8">
            <ShoppingCart className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No purchase orders found</h3>
            <p className="text-gray-600">Try adjusting your search criteria or create a new purchase order.</p>
          </CardContent>
        </Card>
      )}

      {/* Edit Dialog - Similar structure to Add Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Purchase Order</DialogTitle>
            <DialogDescription>Update the purchase order details and items below.</DialogDescription>
          </DialogHeader>
          {/* Similar form structure as Add Dialog */}
          <div className="flex justify-end gap-2 pt-4">
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleEditPurchase} className="bg-orange-600 hover:bg-orange-700">
              Update Purchase Order
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* View Dialog */}
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Purchase Order Details</DialogTitle>
            <DialogDescription>Complete information for {selectedPurchase?.orderNumber}</DialogDescription>
          </DialogHeader>
          {selectedPurchase && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium text-gray-500">Order Number</Label>
                  <p className="text-sm">{selectedPurchase.orderNumber}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-500">Supplier</Label>
                  <p className="text-sm">{selectedPurchase.supplier}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-500">Order Date</Label>
                  <p className="text-sm">{new Date(selectedPurchase.orderDate).toLocaleDateString()}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-500">Expected Date</Label>
                  <p className="text-sm">{new Date(selectedPurchase.expectedDate).toLocaleDateString()}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-500">Status</Label>
                  <Badge className={statusColors[selectedPurchase.status]}>{selectedPurchase.status}</Badge>
                </div>
                {selectedPurchase.receivedDate && (
                  <div>
                    <Label className="text-sm font-medium text-gray-500">Received Date</Label>
                    <p className="text-sm">{new Date(selectedPurchase.receivedDate).toLocaleDateString()}</p>
                  </div>
                )}
              </div>

              <div>
                <Label className="text-sm font-medium text-gray-500">Items</Label>
                <div className="mt-2 space-y-2">
                  {selectedPurchase.items.map((item) => (
                    <div key={item.id} className="flex justify-between items-center p-2 bg-gray-50 rounded">
                      <div>
                        <span className="font-medium">{item.name}</span>
                        <span className="text-gray-500 ml-2">x{item.quantity}</span>
                      </div>
                      <div className="text-right">
                        <div>${item.unitPrice.toFixed(2)} each</div>
                        <div className="font-medium">${item.total.toFixed(2)}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="border-t pt-4">
                <div className="flex justify-end space-y-1">
                  <div className="text-right">
                    <div>Subtotal: ${selectedPurchase.subtotal.toFixed(2)}</div>
                    <div>Tax: ${selectedPurchase.tax.toFixed(2)}</div>
                    <div className="text-lg font-bold">Total: ${selectedPurchase.total.toFixed(2)}</div>
                  </div>
                </div>
              </div>

              {selectedPurchase.notes && (
                <div>
                  <Label className="text-sm font-medium text-gray-500">Notes</Label>
                  <p className="text-sm">{selectedPurchase.notes}</p>
                </div>
              )}
            </div>
          )}
          <div className="flex justify-end pt-4">
            <Button variant="outline" onClick={() => setIsViewDialogOpen(false)}>
              Close
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
