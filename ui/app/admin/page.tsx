import { AdminLayout } from "@/components/layout/admin-layout"

export default function AdminDashboard() {
  return (
    <AdminLayout>
      <div className="space-y-4">
        <h1 className="text-2xl font-bold tracking-tight">Dashboard Overview</h1>
        <p className="text-muted-foreground">
          Welcome to your admin dashboard. Use the sidebar to navigate to different sections.
        </p>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <div className="rounded-lg border bg-card p-6">
            <h3 className="text-lg font-medium">Total Users</h3>
            <p className="text-3xl font-bold">1,234</p>
          </div>
          <div className="rounded-lg border bg-card p-6">
            <h3 className="text-lg font-medium">Active Bookings</h3>
            <p className="text-3xl font-bold">56</p>
          </div>
          <div className="rounded-lg border bg-card p-6">
            <h3 className="text-lg font-medium">Revenue</h3>
            <p className="text-3xl font-bold">$12,345</p>
          </div>
        </div>
      </div>
    </AdminLayout>
  )
}
