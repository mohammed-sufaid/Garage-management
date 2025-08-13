import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Users, Car, ClipboardList, FileText, TrendingUp, Calendar, DollarSign, Wrench } from "lucide-react"

const stats = [
  {
    title: "Total Customers",
    value: "248",
    change: "+12%",
    icon: Users,
    color: "text-blue-600",
  },
  {
    title: "Active Vehicles",
    value: "156",
    change: "+8%",
    icon: Car,
    color: "text-green-600",
  },
  {
    title: "Pending Jobs",
    value: "23",
    change: "-5%",
    icon: ClipboardList,
    color: "text-orange-600",
  },
  {
    title: "Monthly Revenue",
    value: "$12,450",
    change: "+15%",
    icon: DollarSign,
    color: "text-purple-600",
  },
]

const quickActions = [
  {
    title: "Add New Customer",
    description: "Register a new customer in the system",
    href: "/customers",
    icon: Users,
    color: "bg-blue-50 text-blue-600 hover:bg-blue-100",
  },
  {
    title: "Create Job Card",
    description: "Start a new repair job for a vehicle",
    href: "/job-cards",
    icon: Wrench,
    color: "bg-green-50 text-green-600 hover:bg-green-100",
  },
  {
    title: "Generate Invoice",
    description: "Create an invoice for completed work",
    href: "/invoices",
    icon: FileText,
    color: "bg-purple-50 text-purple-600 hover:bg-purple-100",
  },
  {
    title: "View Schedule",
    description: "Check today's appointments and tasks",
    href: "/schedule",
    icon: Calendar,
    color: "bg-orange-50 text-orange-600 hover:bg-orange-100",
  },
]

export function DashboardOverview() {
  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="space-y-2">
        <h2 className="text-2xl font-black text-foreground">Welcome back!</h2>
        <p className="text-muted-foreground">Here's what's happening in your garage today.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.title} className="hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">{stat.title}</CardTitle>
              <stat.icon className={`h-4 w-4 ${stat.color}`} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">{stat.value}</div>
              <p className="text-xs text-muted-foreground">
                <span className={stat.change.startsWith("+") ? "text-green-600" : "text-red-600"}>{stat.change}</span>{" "}
                from last month
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="space-y-4">
        <h3 className="text-lg font-bold text-foreground">Quick Actions</h3>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {quickActions.map((action) => (
            <Card key={action.title} className="hover:shadow-md transition-shadow cursor-pointer group">
              <CardHeader className="space-y-3">
                <div
                  className={`w-12 h-12 rounded-lg flex items-center justify-center ${action.color} group-hover:scale-105 transition-transform`}
                >
                  <action.icon className="h-6 w-6" />
                </div>
                <div className="space-y-1">
                  <CardTitle className="text-sm font-semibold">{action.title}</CardTitle>
                  <CardDescription className="text-xs">{action.description}</CardDescription>
                </div>
              </CardHeader>
            </Card>
          ))}
        </div>
      </div>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Recent Activity
          </CardTitle>
          <CardDescription>Latest updates from your garage operations</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center gap-4 p-3 rounded-lg bg-muted/50">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <div className="flex-1">
                <p className="text-sm font-medium">Job #1234 completed</p>
                <p className="text-xs text-muted-foreground">Honda Civic - Oil change and brake inspection</p>
              </div>
              <span className="text-xs text-muted-foreground">2 hours ago</span>
            </div>
            <div className="flex items-center gap-4 p-3 rounded-lg bg-muted/50">
              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              <div className="flex-1">
                <p className="text-sm font-medium">New customer registered</p>
                <p className="text-xs text-muted-foreground">John Smith - Toyota Camry 2020</p>
              </div>
              <span className="text-xs text-muted-foreground">4 hours ago</span>
            </div>
            <div className="flex items-center gap-4 p-3 rounded-lg bg-muted/50">
              <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
              <div className="flex-1">
                <p className="text-sm font-medium">Invoice #INV-2024-001 sent</p>
                <p className="text-xs text-muted-foreground">$450.00 - Engine diagnostic and repair</p>
              </div>
              <span className="text-xs text-muted-foreground">6 hours ago</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
