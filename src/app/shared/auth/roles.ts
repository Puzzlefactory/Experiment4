import type { PrototypePermission, PrototypeRoleDefinition } from './types'

export const prototypePermissions = {
  viewDashboard: 'dashboard:view',
  viewProjects: 'projects:view',
  createProjects: 'projects:create',
  editProjects: 'projects:edit',
  viewSettings: 'settings:view',
  manageRoles: 'roles:manage',
} as const satisfies Record<string, PrototypePermission>

export const prototypeRoles = [
  {
    role: 'admin',
    label: 'Admin',
    description: 'Can view, create, edit, and configure prototype data.',
    permissions: Object.values(prototypePermissions),
  },
  {
    role: 'manager',
    label: 'Manager',
    description: 'Can view and create project work, but cannot manage roles.',
    permissions: [
      prototypePermissions.viewDashboard,
      prototypePermissions.viewProjects,
      prototypePermissions.createProjects,
      prototypePermissions.editProjects,
    ],
  },
  {
    role: 'viewer',
    label: 'Viewer',
    description: 'Can view dashboard and project data only.',
    permissions: [
      prototypePermissions.viewDashboard,
      prototypePermissions.viewProjects,
    ],
  },
] satisfies PrototypeRoleDefinition[]
