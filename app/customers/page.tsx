import { DashboardLayout } from "@/components/dashboard-layout"
import { CustomerManagement } from "@/components/customer-management"

export default function CustomersPage() {
  return (
    <DashboardLayout>
      <CustomerManagement />
    </DashboardLayout>
  )
}
