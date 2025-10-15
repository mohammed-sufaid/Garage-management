import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/src/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/src/components/ui/tabs"
import { Button } from "@/src/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/src/components/ui/select"
import { Badge } from "@/src/components/ui/badge"
import {
  CalendarIcon,
  TrendingUpIcon,
  UsersIcon,
  PackageIcon,
  CreditCardIcon,
  DownloadIcon,
  PrinterIcon,
} from "lucide-react"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area,
} from "recharts"

// Mock data - in real app, this would come from your database
const revenueData = [
  { month: "Jan", revenue: 45000, expenses: 32000, profit: 13000 },
  { month: "Feb", revenue: 52000, expenses: 35000, profit: 17000 },
  { month: "Mar", revenue: 48000, expenses: 33000, profit: 15000 },
  { month: "Apr", revenue: 61000, expenses: 38000, profit: 23000 },
  { month: "May", revenue: 55000, expenses: 36000, profit: 19000 },
  { month: "Jun", revenue: 67000, expenses: 41000, profit: 26000 },
]

const customerAnalysisData = [
  { segment: "New Customers", count: 45, percentage: 25 },
  { segment: "Returning Customers", count: 89, percentage: 50 },
  { segment: "VIP Customers", count: 34, percentage: 19 },
  { segment: "Inactive Customers", count: 12, percentage: 6 },
]

const stockData = [
  { category: "Engine Parts", inStock: 245, lowStock: 12, outOfStock: 3 },
  { category: "Brake Components", inStock: 189, lowStock: 8, outOfStock: 1 },
  { category: "Electrical", inStock: 156, lowStock: 15, outOfStock: 5 },
  { category: "Body Parts", inStock: 98, lowStock: 6, outOfStock: 2 },
  { category: "Fluids & Oils", inStock: 234, lowStock: 4, outOfStock: 0 },
]

const expenseData = [
  { category: "Parts & Inventory", amount: 125000, percentage: 45 },
  { category: "Labor Costs", amount: 89000, percentage: 32 },
  { category: "Utilities", amount: 23000, percentage: 8 },
  { category: "Equipment", amount: 18000, percentage: 7 },
  { category: "Marketing", amount: 12000, percentage: 4 },
  { category: "Other", amount: 11000, percentage: 4 },
]

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884D8", "#82CA9D"]

export function ReportsManagement() {
  const [dateRange, setDateRange] = useState("last-6-months")

  const handleExport = (reportType: string, format: "pdf" | "csv" | "excel" = "pdf") => {
    const reportData = getReportData(reportType)
    const fileName = `${reportType}-report-${new Date().toISOString().split("T")[0]}`

    if (format === "csv") {
      exportToCSV(reportData, fileName)
    } else if (format === "excel") {
      exportToExcel(reportData, fileName)
    } else {
      exportToPDF(reportType, fileName)
    }
  }

  const handlePrint = (reportType: string) => {
    const printContent = generatePrintContent(reportType)
    const printWindow = window.open("", "_blank")

    if (printWindow) {
      printWindow.document.write(`
        <!DOCTYPE html>
        <html>
          <head>
            <title>${reportType.charAt(0).toUpperCase() + reportType.slice(1)} Report</title>
            <style>
              body { font-family: Arial, sans-serif; margin: 20px; }
              .header { text-align: center; margin-bottom: 30px; border-bottom: 2px solid #333; padding-bottom: 20px; }
              .company-name { font-size: 24px; font-weight: bold; margin-bottom: 5px; }
              .report-title { font-size: 18px; color: #666; }
              .report-date { font-size: 14px; color: #888; margin-top: 10px; }
              .metrics-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 20px; margin: 30px 0; }
              .metric-card { border: 1px solid #ddd; padding: 15px; border-radius: 8px; }
              .metric-title { font-size: 14px; color: #666; margin-bottom: 5px; }
              .metric-value { font-size: 24px; font-weight: bold; color: #333; }
              .metric-change { font-size: 12px; color: #666; margin-top: 5px; }
              .data-table { width: 100%; border-collapse: collapse; margin: 20px 0; }
              .data-table th, .data-table td { border: 1px solid #ddd; padding: 12px; text-align: left; }
              .data-table th { background-color: #f5f5f5; font-weight: bold; }
              .data-table tr:nth-child(even) { background-color: #f9f9f9; }
              .footer { margin-top: 40px; text-align: center; font-size: 12px; color: #666; border-top: 1px solid #ddd; padding-top: 20px; }
              @media print { body { margin: 0; } .no-print { display: none; } }
            </style>
          </head>
          <body>
            ${printContent}
          </body>
        </html>
      `)
      printWindow.document.close()
      printWindow.focus()
      setTimeout(() => {
        printWindow.print()
        printWindow.close()
      }, 250)
    }
  }

  const getReportData = (reportType: string) => {
    switch (reportType) {
      case "revenue":
        return revenueData
      case "customers":
        return customerAnalysisData
      case "stock":
        return stockData
      case "expenses":
        return expenseData
      default:
        return []
    }
  }

  const exportToCSV = (data: any[], fileName: string) => {
    if (data.length === 0) return

    const headers = Object.keys(data[0])
    const csvContent = [
      headers.join(","),
      ...data.map((row) => headers.map((header) => `"${row[header]}"`).join(",")),
    ].join("\n")

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" })
    const link = document.createElement("a")
    link.href = URL.createObjectURL(blob)
    link.download = `${fileName}.csv`
    link.click()
  }

  const exportToExcel = (data: any[], fileName: string) => {
    const worksheet = data.map((row) => Object.values(row))
    const headers = data.length > 0 ? Object.keys(data[0]) : []

    let csvContent = headers.join("\t") + "\n"
    worksheet.forEach((row) => {
      csvContent += row.join("\t") + "\n"
    })

    const blob = new Blob([csvContent], { type: "application/vnd.ms-excel" })
    const link = document.createElement("a")
    link.href = URL.createObjectURL(blob)
    link.download = `${fileName}.xls`
    link.click()
  }

  const exportToPDF = (reportType: string, fileName: string) => {
    const printContent = generatePrintContent(reportType)
    const printWindow = window.open("", "_blank")

    if (printWindow) {
      printWindow.document.write(`
        <!DOCTYPE html>
        <html>
          <head>
            <title>${reportType.charAt(0).toUpperCase() + reportType.slice(1)} Report</title>
            <style>
              body { font-family: Arial, sans-serif; margin: 20px; }
              .header { text-align: center; margin-bottom: 30px; border-bottom: 2px solid #333; padding-bottom: 20px; }
              .company-name { font-size: 24px; font-weight: bold; margin-bottom: 5px; }
              .report-title { font-size: 18px; color: #666; }
              .report-date { font-size: 14px; color: #888; margin-top: 10px; }
              .metrics-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 20px; margin: 30px 0; }
              .metric-card { border: 1px solid #ddd; padding: 15px; border-radius: 8px; }
              .metric-title { font-size: 14px; color: #666; margin-bottom: 5px; }
              .metric-value { font-size: 24px; font-weight: bold; color: #333; }
              .data-table { width: 100%; border-collapse: collapse; margin: 20px 0; }
              .data-table th, .data-table td { border: 1px solid #ddd; padding: 12px; text-align: left; }
              .data-table th { background-color: #f5f5f5; font-weight: bold; }
              .data-table tr:nth-child(even) { background-color: #f9f9f9; }
            </style>
          </head>
          <body onload="window.print(); window.close();">
            ${printContent}
          </body>
        </html>
      `)
      printWindow.document.close()
    }
  }

  const generatePrintContent = (reportType: string) => {
    const currentDate = new Date().toLocaleDateString()
    const reportTitle = reportType.charAt(0).toUpperCase() + reportType.slice(1) + " Report"

    let content = `
      <div class="header">
        <div class="company-name">AutoCMS Garage Management</div>
        <div class="report-title">${reportTitle}</div>
        <div class="report-date">Generated on: ${currentDate}</div>
      </div>
    `

    switch (reportType) {
      case "revenue":
        content += `
          <div class="metrics-grid">
            <div class="metric-card">
              <div class="metric-title">Total Revenue</div>
              <div class="metric-value">₹3,28,000</div>
              <div class="metric-change">+12.5% from last period</div>
            </div>
            <div class="metric-card">
              <div class="metric-title">Total Expenses</div>
              <div class="metric-value">₹2,15,000</div>
              <div class="metric-change">+8.2% from last period</div>
            </div>
            <div class="metric-card">
              <div class="metric-title">Net Profit</div>
              <div class="metric-value">₹1,13,000</div>
              <div class="metric-change">+18.5% from last period</div>
            </div>
          </div>
          <table class="data-table">
            <thead>
              <tr><th>Month</th><th>Revenue</th><th>Expenses</th><th>Profit</th></tr>
            </thead>
            <tbody>
              ${revenueData
                .map(
                  (item) => `
                <tr>
                  <td>${item.month}</td>
                  <td>₹${item.revenue.toLocaleString()}</td>
                  <td>₹${item.expenses.toLocaleString()}</td>
                  <td>₹${item.profit.toLocaleString()}</td>
                </tr>
              `,
                )
                .join("")}
            </tbody>
          </table>
        `
        break
      case "customers":
        content += `
          <div class="metrics-grid">
            <div class="metric-card">
              <div class="metric-title">Total Customers</div>
              <div class="metric-value">180</div>
              <div class="metric-change">+8 new this month</div>
            </div>
            <div class="metric-card">
              <div class="metric-title">Customer Retention</div>
              <div class="metric-value">87%</div>
              <div class="metric-change">6-month retention rate</div>
            </div>
            <div class="metric-card">
              <div class="metric-title">Average Order Value</div>
              <div class="metric-value">₹1,825</div>
              <div class="metric-change">Per service visit</div>
            </div>
          </div>
          <table class="data-table">
            <thead>
              <tr><th>Customer Segment</th><th>Count</th><th>Percentage</th></tr>
            </thead>
            <tbody>
              ${customerAnalysisData
                .map(
                  (item) => `
                <tr>
                  <td>${item.segment}</td>
                  <td>${item.count}</td>
                  <td>${item.percentage}%</td>
                </tr>
              `,
                )
                .join("")}
            </tbody>
          </table>
        `
        break
      case "stock":
        content += `
          <div class="metrics-grid">
            <div class="metric-card">
              <div class="metric-title">Total Stock Items</div>
              <div class="metric-value">922</div>
              <div class="metric-change">Well stocked items</div>
            </div>
            <div class="metric-card">
              <div class="metric-title">Low Stock Items</div>
              <div class="metric-value">45</div>
              <div class="metric-change">Need restocking</div>
            </div>
            <div class="metric-card">
              <div class="metric-title">Out of Stock</div>
              <div class="metric-value">11</div>
              <div class="metric-change">Immediate attention</div>
            </div>
          </div>
          <table class="data-table">
            <thead>
              <tr><th>Category</th><th>In Stock</th><th>Low Stock</th><th>Out of Stock</th></tr>
            </thead>
            <tbody>
              ${stockData
                .map(
                  (item) => `
                <tr>
                  <td>${item.category}</td>
                  <td>${item.inStock}</td>
                  <td>${item.lowStock}</td>
                  <td>${item.outOfStock}</td>
                </tr>
              `,
                )
                .join("")}
            </tbody>
          </table>
        `
        break
      case "expenses":
        content += `
          <div class="metrics-grid">
            <div class="metric-card">
              <div class="metric-title">Total Expenses</div>
              <div class="metric-value">₹2,78,000</div>
              <div class="metric-change">+5.2% from last period</div>
            </div>
            <div class="metric-card">
              <div class="metric-title">Monthly Average</div>
              <div class="metric-value">₹46,333</div>
              <div class="metric-change">Average per month</div>
            </div>
            <div class="metric-card">
              <div class="metric-title">Cost per Job</div>
              <div class="metric-value">₹1,245</div>
              <div class="metric-change">Average material cost</div>
            </div>
          </div>
          <table class="data-table">
            <thead>
              <tr><th>Expense Category</th><th>Amount</th><th>Percentage</th></tr>
            </thead>
            <tbody>
              ${expenseData
                .map(
                  (item) => `
                <tr>
                  <td>${item.category}</td>
                  <td>₹${item.amount.toLocaleString()}</td>
                  <td>${item.percentage}%</td>
                </tr>
              `,
                )
                .join("")}
            </tbody>
          </table>
        `
        break
    }

    content += `
      <div class="footer">
        <p>This report was generated automatically by AutoCMS Garage Management System</p>
        <p>For questions or support, contact your system administrator</p>
      </div>
    `

    return content
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Reports & Analytics</h1>
          <p className="text-gray-600 mt-1">Comprehensive business insights and performance metrics</p>
        </div>
        <div className="flex items-center gap-3">
          <Select value={dateRange} onValueChange={setDateRange}>
            <SelectTrigger className="w-48">
              <CalendarIcon className="h-4 w-4 mr-2" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="last-30-days">Last 30 Days</SelectItem>
              <SelectItem value="last-3-months">Last 3 Months</SelectItem>
              <SelectItem value="last-6-months">Last 6 Months</SelectItem>
              <SelectItem value="last-year">Last Year</SelectItem>
              <SelectItem value="custom">Custom Range</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Key Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <TrendingUpIcon className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">₹3,28,000</div>
            <p className="text-xs text-gray-600">+12.5% from last period</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Customers</CardTitle>
            <UsersIcon className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">180</div>
            <p className="text-xs text-gray-600">+8 new this month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Stock Items</CardTitle>
            <PackageIcon className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">922</div>
            <p className="text-xs text-gray-600">45 items low stock</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Expenses</CardTitle>
            <CreditCardIcon className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">₹2,78,000</div>
            <p className="text-xs text-gray-600">+5.2% from last period</p>
          </CardContent>
        </Card>
      </div>

      {/* Reports Tabs */}
      <Tabs defaultValue="revenue" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="revenue">Revenue Report</TabsTrigger>
          <TabsTrigger value="customers">Customer Analysis</TabsTrigger>
          <TabsTrigger value="stock">Stock Analysis</TabsTrigger>
          <TabsTrigger value="expenses">Expense Report</TabsTrigger>
        </TabsList>

        {/* Revenue Report */}
        <TabsContent value="revenue" className="space-y-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Revenue & Profit Analysis</CardTitle>
                <CardDescription>Monthly revenue, expenses, and profit trends</CardDescription>
              </div>
              <div className="flex gap-2">
                <div className="flex gap-1">
                  <Button variant="outline" size="sm" onClick={() => handleExport("revenue", "pdf")}>
                    <DownloadIcon className="h-4 w-4 mr-2" />
                    PDF
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => handleExport("revenue", "csv")}>
                    <DownloadIcon className="h-4 w-4 mr-2" />
                    CSV
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => handleExport("revenue", "excel")}>
                    <DownloadIcon className="h-4 w-4 mr-2" />
                    Excel
                  </Button>
                </div>
                <Button variant="outline" size="sm" onClick={() => handlePrint("revenue")}>
                  <PrinterIcon className="h-4 w-4 mr-2" />
                  Print
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={revenueData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip formatter={(value) => [`₹${value.toLocaleString()}`, ""]} />
                    <Bar dataKey="revenue" fill="#0088FE" name="Revenue" />
                    <Bar dataKey="expenses" fill="#FF8042" name="Expenses" />
                    <Bar dataKey="profit" fill="#00C49F" name="Profit" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Revenue Trend</CardTitle>
                <CardDescription>6-month revenue progression</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={revenueData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Tooltip formatter={(value) => [`₹${value.toLocaleString()}`, "Revenue"]} />
                      <Area type="monotone" dataKey="revenue" stroke="#0088FE" fill="#0088FE" fillOpacity={0.3} />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Profit Margin</CardTitle>
                <CardDescription>Monthly profit trends</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={revenueData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Tooltip formatter={(value) => [`₹${value.toLocaleString()}`, "Profit"]} />
                      <Line type="monotone" dataKey="profit" stroke="#00C49F" strokeWidth={3} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Customer Analysis */}
        <TabsContent value="customers" className="space-y-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Customer Segmentation</CardTitle>
                <CardDescription>Customer distribution and behavior analysis</CardDescription>
              </div>
              <div className="flex gap-2">
                <div className="flex gap-1">
                  <Button variant="outline" size="sm" onClick={() => handleExport("customers", "pdf")}>
                    <DownloadIcon className="h-4 w-4 mr-2" />
                    PDF
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => handleExport("customers", "csv")}>
                    <DownloadIcon className="h-4 w-4 mr-2" />
                    CSV
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => handleExport("customers", "excel")}>
                    <DownloadIcon className="h-4 w-4 mr-2" />
                    Excel
                  </Button>
                </div>
                <Button variant="outline" size="sm" onClick={() => handlePrint("customers")}>
                  <PrinterIcon className="h-4 w-4 mr-2" />
                  Print
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={customerAnalysisData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ segment, percentage }) => `${segment}: ${percentage}%`}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="count"
                      >
                        {customerAnalysisData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </div>

                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Customer Insights</h3>
                  {customerAnalysisData.map((item, index) => (
                    <div key={item.segment} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center gap-3">
                        <div
                          className="w-4 h-4 rounded-full"
                          style={{ backgroundColor: COLORS[index % COLORS.length] }}
                        />
                        <span className="font-medium">{item.segment}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant="secondary">{item.count}</Badge>
                        <span className="text-sm text-gray-600">{item.percentage}%</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Customer Retention</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-green-600">87%</div>
                <p className="text-sm text-gray-600">6-month retention rate</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Average Order Value</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-blue-600">₹1,825</div>
                <p className="text-sm text-gray-600">Per service visit</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Customer Lifetime Value</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-purple-600">₹12,450</div>
                <p className="text-sm text-gray-600">Average CLV</p>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Stock Analysis */}
        <TabsContent value="stock" className="space-y-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Inventory Status</CardTitle>
                <CardDescription>Stock levels across all categories</CardDescription>
              </div>
              <div className="flex gap-2">
                <div className="flex gap-1">
                  <Button variant="outline" size="sm" onClick={() => handleExport("stock", "pdf")}>
                    <DownloadIcon className="h-4 w-4 mr-2" />
                    PDF
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => handleExport("stock", "csv")}>
                    <DownloadIcon className="h-4 w-4 mr-2" />
                    CSV
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => handleExport("stock", "excel")}>
                    <DownloadIcon className="h-4 w-4 mr-2" />
                    Excel
                  </Button>
                </div>
                <Button variant="outline" size="sm" onClick={() => handlePrint("stock")}>
                  <PrinterIcon className="h-4 w-4 mr-2" />
                  Print
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={stockData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="category" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="inStock" fill="#00C49F" name="In Stock" />
                    <Bar dataKey="lowStock" fill="#FFBB28" name="Low Stock" />
                    <Bar dataKey="outOfStock" fill="#FF8042" name="Out of Stock" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Stock Alerts</CardTitle>
                <CardDescription>Items requiring attention</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-red-50 rounded-lg border border-red-200">
                  <div>
                    <p className="font-medium text-red-800">Out of Stock Items</p>
                    <p className="text-sm text-red-600">11 items need immediate restocking</p>
                  </div>
                  <Badge variant="destructive">11</Badge>
                </div>
                <div className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg border border-yellow-200">
                  <div>
                    <p className="font-medium text-yellow-800">Low Stock Items</p>
                    <p className="text-sm text-yellow-600">45 items below minimum threshold</p>
                  </div>
                  <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">
                    45
                  </Badge>
                </div>
                <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg border border-green-200">
                  <div>
                    <p className="font-medium text-green-800">Well Stocked</p>
                    <p className="text-sm text-green-600">922 items in good stock</p>
                  </div>
                  <Badge variant="secondary" className="bg-green-100 text-green-800">
                    922
                  </Badge>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Top Moving Items</CardTitle>
                <CardDescription>Most frequently used parts</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {[
                  { name: "Engine Oil Filter", usage: 45, trend: "+12%" },
                  { name: "Brake Pads", usage: 38, trend: "+8%" },
                  { name: "Air Filter", usage: 32, trend: "+15%" },
                  { name: "Spark Plugs", usage: 28, trend: "+5%" },
                  { name: "Transmission Fluid", usage: 24, trend: "+3%" },
                ].map((item) => (
                  <div key={item.name} className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">{item.name}</p>
                      <p className="text-sm text-gray-600">{item.usage} units this month</p>
                    </div>
                    <Badge variant="outline" className="text-green-600">
                      {item.trend}
                    </Badge>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Expense Report */}
        <TabsContent value="expenses" className="space-y-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Expense Breakdown</CardTitle>
                <CardDescription>Detailed expense analysis by category</CardDescription>
              </div>
              <div className="flex gap-2">
                <div className="flex gap-1">
                  <Button variant="outline" size="sm" onClick={() => handleExport("expenses", "pdf")}>
                    <DownloadIcon className="h-4 w-4 mr-2" />
                    PDF
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => handleExport("expenses", "csv")}>
                    <DownloadIcon className="h-4 w-4 mr-2" />
                    CSV
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => handleExport("expenses", "excel")}>
                    <DownloadIcon className="h-4 w-4 mr-2" />
                    Excel
                  </Button>
                </div>
                <Button variant="outline" size="sm" onClick={() => handlePrint("expenses")}>
                  <PrinterIcon className="h-4 w-4 mr-2" />
                  Print
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={expenseData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ category, percentage }) => `${category}: ${percentage}%`}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="amount"
                      >
                        {expenseData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value) => [`₹${value.toLocaleString()}`, ""]} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>

                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Expense Categories</h3>
                  {expenseData.map((item, index) => (
                    <div key={item.category} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center gap-3">
                        <div
                          className="w-4 h-4 rounded-full"
                          style={{ backgroundColor: COLORS[index % COLORS.length] }}
                        />
                        <span className="font-medium">{item.category}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="font-semibold">₹{item.amount.toLocaleString()}</span>
                        <Badge variant="secondary">{item.percentage}%</Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Monthly Expenses</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-red-600">₹46,333</div>
                <p className="text-sm text-gray-600">Average per month</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Cost per Job</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-orange-600">₹1,245</div>
                <p className="text-sm text-gray-600">Average material cost</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Expense Growth</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-blue-600">+5.2%</div>
                <p className="text-sm text-gray-600">Compared to last period</p>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
