"use client"

import { useState } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { Search, Plus, Edit, Trash2, Users, Shield } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"

export interface Permission {
  id: string
  name: string
  description: string
  module: string
}

export interface Role {
  id: string
  name: string
  description: string
  permissions: string[] // Permission IDs
  usersCount: number
}

interface RoleManagerProps {
  roles: Role[]
  permissions: Permission[]
  onCreateRole?: (role: Omit<Role, "id" | "usersCount">) => void
  onUpdateRole?: (id: string, role: Omit<Role, "id" | "usersCount">) => void
  onDeleteRole?: (id: string) => void
}

export function RoleManager({ roles, permissions, onCreateRole, onUpdateRole, onDeleteRole }: RoleManagerProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingRole, setEditingRole] = useState<Role | null>(null)
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    permissions: [] as string[],
  })

  // Group permissions by module
  const permissionsByModule: Record<string, Permission[]> = permissions.reduce(
    (acc, permission) => {
      if (!acc[permission.module]) {
        acc[permission.module] = []
      }
      acc[permission.module].push(permission)
      return acc
    },
    {} as Record<string, Permission[]>,
  )

  // Filter roles based on search query
  const filteredRoles = roles.filter(
    (role) =>
      role.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      role.description.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  const handleOpenDialog = (role?: Role) => {
    if (role) {
      setEditingRole(role)
      setFormData({
        name: role.name,
        description: role.description,
        permissions: [...role.permissions],
      })
    } else {
      setEditingRole(null)
      setFormData({
        name: "",
        description: "",
        permissions: [],
      })
    }
    setIsDialogOpen(true)
  }

  const handleCloseDialog = () => {
    setIsDialogOpen(false)
    setEditingRole(null)
  }

  const handleSubmit = () => {
    if (editingRole) {
      onUpdateRole?.(editingRole.id, formData)
    } else {
      onCreateRole?.(formData)
    }
    handleCloseDialog()
  }

  const handlePermissionToggle = (permissionId: string) => {
    setFormData((prev) => {
      if (prev.permissions.includes(permissionId)) {
        return { ...prev, permissions: prev.permissions.filter((id) => id !== permissionId) }
      } else {
        return { ...prev, permissions: [...prev.permissions, permissionId] }
      }
    })
  }

  const handleModuleToggle = (modulePermissions: Permission[]) => {
    const modulePermissionIds = modulePermissions.map((p) => p.id)
    const allSelected = modulePermissions.every((p) => formData.permissions.includes(p.id))

    if (allSelected) {
      // Remove all permissions for this module
      setFormData((prev) => ({
        ...prev,
        permissions: prev.permissions.filter((id) => !modulePermissionIds.includes(id)),
      }))
    } else {
      // Add all permissions for this module
      setFormData((prev) => {
        const newPermissions = [...prev.permissions]
        modulePermissionIds.forEach((id) => {
          if (!newPermissions.includes(id)) {
            newPermissions.push(id)
          }
        })
        return { ...prev, permissions: newPermissions }
      })
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-4 justify-between">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search roles..."
            className="pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <Button onClick={() => handleOpenDialog()}>
          <Plus className="mr-2 h-4 w-4" /> Add Role
        </Button>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Role</TableHead>
              <TableHead>Description</TableHead>
              <TableHead>Permissions</TableHead>
              <TableHead>Users</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredRoles.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="h-24 text-center">
                  No roles found.
                </TableCell>
              </TableRow>
            ) : (
              filteredRoles.map((role) => (
                <TableRow key={role.id}>
                  <TableCell className="font-medium">
                    <div className="flex items-center gap-2">
                      <Shield className="h-4 w-4 text-muted-foreground" />
                      {role.name}
                    </div>
                  </TableCell>
                  <TableCell>{role.description}</TableCell>
                  <TableCell>
                    <Badge variant="outline">{role.permissions.length} permissions</Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <Users className="h-4 w-4 text-muted-foreground" />
                      {role.usersCount}
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button variant="ghost" size="icon" onClick={() => handleOpenDialog(role)}>
                        <Edit className="h-4 w-4" />
                        <span className="sr-only">Edit</span>
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-red-500"
                        onClick={() => onDeleteRole?.(role.id)}
                        disabled={role.name === "Administrator" || role.name === "Super Admin"}
                      >
                        <Trash2 className="h-4 w-4" />
                        <span className="sr-only">Delete</span>
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Role Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>{editingRole ? "Edit Role" : "Create Role"}</DialogTitle>
            <DialogDescription>
              {editingRole
                ? "Update the role details and permissions."
                : "Create a new role with specific permissions."}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">
                Name
              </Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="col-span-3"
                disabled={editingRole?.name === "Administrator" || editingRole?.name === "Super Admin"}
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="description" className="text-right">
                Description
              </Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 gap-4">
              <Label className="text-right pt-2">Permissions</Label>
              <div className="col-span-3 border rounded-md p-4 space-y-6">
                {Object.entries(permissionsByModule).map(([module, modulePermissions]) => (
                  <div key={module} className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id={`module-${module}`}
                        checked={modulePermissions.every((p) => formData.permissions.includes(p.id))}
                        onCheckedChange={() => handleModuleToggle(modulePermissions)}
                      />
                      <Label htmlFor={`module-${module}`} className="font-medium">
                        {module}
                      </Label>
                    </div>
                    <div className="ml-6 grid grid-cols-1 md:grid-cols-2 gap-2">
                      {modulePermissions.map((permission) => (
                        <div key={permission.id} className="flex items-center space-x-2">
                          <Checkbox
                            id={permission.id}
                            checked={formData.permissions.includes(permission.id)}
                            onCheckedChange={() => handlePermissionToggle(permission.id)}
                            disabled={
                              (editingRole?.name === "Administrator" || editingRole?.name === "Super Admin") &&
                              formData.permissions.includes(permission.id)
                            }
                          />
                          <Label htmlFor={permission.id} className="text-sm">
                            {permission.name}
                          </Label>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={handleCloseDialog}>
              Cancel
            </Button>
            <Button onClick={handleSubmit} disabled={!formData.name.trim()}>
              {editingRole ? "Update" : "Create"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
