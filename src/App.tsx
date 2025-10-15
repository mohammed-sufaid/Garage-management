import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { Toaster } from '@/src/components/ui/toaster'
import { DashboardLayout } from '@/src/components/dashboard-layout'
import { DashboardOverview } from '@/src/components/dashboard-overview'
import { CustomerManagement } from '@/src/components/customer-management'
import { VehicleManagement } from '@/src/components/vehicle-management'
import { JobCardManagement } from '@/src/components/job-card-management'
import { InvoiceManagement } from '@/src/components/invoice-management'
import { EmployeeManagement } from '@/src/components/employee-management'
import { PurchaseManagement } from '@/src/components/purchase-management'
import { ReportsManagement } from '@/src/components/reports-management'
import { OrganizationManagement } from '@/src/components/organization-management'
import { AuthForm } from '@/src/components/auth-form'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/auth" element={
          <div className="min-h-screen relative overflow-hidden">
            <div
              className="absolute inset-0 bg-cover bg-center bg-no-repeat"
              style={{
                backgroundImage: `url('/modern-auto-garage.png')`,
                opacity: 0.3,
              }}
            />
            <div className="absolute inset-0 bg-gradient-to-br from-slate-900/50 to-slate-800/50" />
            <div className="relative z-10 flex items-center justify-center min-h-screen p-4">
              <AuthForm />
            </div>
          </div>
        } />

        <Route path="/" element={
          <DashboardLayout>
            <DashboardOverview />
          </DashboardLayout>
        } />

        <Route path="/customers" element={
          <DashboardLayout>
            <CustomerManagement />
          </DashboardLayout>
        } />

        <Route path="/vehicles" element={
          <DashboardLayout>
            <VehicleManagement />
          </DashboardLayout>
        } />

        <Route path="/job-cards" element={
          <DashboardLayout>
            <JobCardManagement />
          </DashboardLayout>
        } />

        <Route path="/invoices" element={
          <DashboardLayout>
            <InvoiceManagement />
          </DashboardLayout>
        } />

        <Route path="/employees" element={
          <DashboardLayout>
            <EmployeeManagement />
          </DashboardLayout>
        } />

        <Route path="/purchases" element={
          <DashboardLayout>
            <PurchaseManagement />
          </DashboardLayout>
        } />

        <Route path="/reports" element={
          <DashboardLayout>
            <ReportsManagement />
          </DashboardLayout>
        } />

        <Route path="/organization" element={
          <DashboardLayout>
            <OrganizationManagement />
          </DashboardLayout>
        } />

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      <Toaster />
    </BrowserRouter>
  )
}

export default App
