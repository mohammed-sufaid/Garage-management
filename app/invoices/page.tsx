import { DashboardLayout } from "@/components/dashboard-layout"
import { InvoiceManagement } from "@/components/invoice-management"

export default function InvoicesPage() {
  return (
    <DashboardLayout>
      <InvoiceManagement />
    </DashboardLayout>
  )
}
