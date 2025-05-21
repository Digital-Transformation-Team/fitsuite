"use client"

import { useEffect, useState } from "react"
import { AdminLayout } from "@/components/layout/admin-layout"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Loader2 } from "lucide-react"

import { StatusCard } from "@/components/security/status-card"
import { ActionLogTable } from "@/components/security/action-log-table"
import { RoleManager } from "@/components/security/role-manager"
import { DataProtectionStatus } from "@/components/security/data-protection-status"

import { useAppDispatch, useAppSelector } from "@/store/hooks"
import {
  fetchActionLogsAsync,
  fetchSystemStatusAsync,
  fetchRolesAndPermissionsAsync,
  fetchDataProtectionItemsAsync,
  createRoleAsync,
  updateRoleAsync,
  deleteRoleAsync,
  updateDataProtectionItemAsync,
} from "@/store/slices/securitySlice"
import type { Role } from "@/types/security"

export default function SecurityPage() {
  const dispatch = useAppDispatch()
  const [activeTab, setActiveTab] = useState("logs")

  // Get data from Redux store
  const actionLogs = useAppSelector((state) => state.security.actionLogs)
  const systemStatus = useAppSelector((state) => state.security.systemStatus)
  const rolesAndPermissions = useAppSelector((state) => state.security.rolesAndPermissions)
  const dataProtection = useAppSelector((state) => state.security.dataProtection)

  // Fetch data on component mount
  useEffect(() => {
    dispatch(fetchActionLogsAsync())
    dispatch(fetchSystemStatusAsync())
    dispatch(fetchRolesAndPermissionsAsync())
    dispatch(fetchDataProtectionItemsAsync())
  }, [dispatch])

  // Role management handlers
  const handleCreateRole = (role: Omit<Role, "id" | "usersCount">) => {
    dispatch(createRoleAsync(role))
  }

  const handleUpdateRole = (id: string, roleData: Omit<Role, "id" | "usersCount">) => {
    dispatch(updateRoleAsync({ id, roleData }))
  }

  const handleDeleteRole = (id: string) => {
    dispatch(deleteRoleAsync(id))
  }

  // Export logs handler
  const handleExportLogs = () => {
    console.log("Exporting logs...")
    // In a real app, you would implement actual export functionality here
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold tracking-tight">Security & System Monitoring</h1>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList>
            <TabsTrigger value="logs">Action Logs</TabsTrigger>
            <TabsTrigger value="status">System Status</TabsTrigger>
            <TabsTrigger value="access">Access Management</TabsTrigger>
            <TabsTrigger value="data-protection">Data Protection</TabsTrigger>
          </TabsList>

          {/* Action Logs Tab */}
          <TabsContent value="logs" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Action Logs</CardTitle>
                <CardDescription>
                  Track user actions and system events. Filter by user, action type, or status.
                </CardDescription>
              </CardHeader>
              <CardContent>
                {actionLogs.loading ? (
                  <div className="flex justify-center items-center h-64">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                  </div>
                ) : actionLogs.error ? (
                  <div className="text-center text-red-500 p-4">Error loading action logs: {actionLogs.error}</div>
                ) : (
                  <ActionLogTable logs={actionLogs.data} onExport={handleExportLogs} />
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* System Status Tab */}
          <TabsContent value="status" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>System Status</CardTitle>
                <CardDescription>
                  Monitor the status of system components and services. Last updated:{" "}
                  {systemStatus.lastUpdated ? new Date(systemStatus.lastUpdated).toLocaleString() : "Never"}
                </CardDescription>
              </CardHeader>
              <CardContent>
                {systemStatus.loading ? (
                  <div className="flex justify-center items-center h-64">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                  </div>
                ) : systemStatus.error ? (
                  <div className="text-center text-red-500 p-4">Error loading system status: {systemStatus.error}</div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {systemStatus.data.map((status, index) => (
                      <StatusCard
                        key={index}
                        title={status.title}
                        description={status.description}
                        status={status.status}
                        lastChecked={status.lastChecked}
                        uptime={status.uptime}
                        details={status.details}
                      />
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Access Management Tab */}
          <TabsContent value="access" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Access Management</CardTitle>
                <CardDescription>
                  Manage user roles and permissions. Define what actions each role can perform in the system.
                </CardDescription>
              </CardHeader>
              <CardContent>
                {rolesAndPermissions.loading ? (
                  <div className="flex justify-center items-center h-64">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                  </div>
                ) : rolesAndPermissions.error ? (
                  <div className="text-center text-red-500 p-4">
                    Error loading roles and permissions: {rolesAndPermissions.error}
                  </div>
                ) : (
                  <RoleManager
                    roles={rolesAndPermissions.roles}
                    permissions={rolesAndPermissions.permissions}
                    onCreateRole={handleCreateRole}
                    onUpdateRole={handleUpdateRole}
                    onDeleteRole={handleDeleteRole}
                  />
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Data Protection Tab */}
          <TabsContent value="data-protection" className="space-y-4">
            {dataProtection.loading ? (
              <div className="flex justify-center items-center h-64">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            ) : dataProtection.error ? (
              <div className="text-center text-red-500 p-4">
                Error loading data protection items: {dataProtection.error}
              </div>
            ) : (
              <DataProtectionStatus
                items={dataProtection.items}
                overallScore={dataProtection.overallScore}
                lastAudit={dataProtection.lastAudit || ""}
                nextAudit={dataProtection.nextAudit || ""}
                onUpdateItem={(id, data) => dispatch(updateDataProtectionItemAsync({ id, data }))}
              />
            )}
          </TabsContent>
        </Tabs>
      </div>
    </AdminLayout>
  )
}
