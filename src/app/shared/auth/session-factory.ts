import { createPrototypeSession } from './prototype-token'
import { prototypeRolePolicy } from './policy'
import type { PrototypeRoleName, PrototypeSession } from './types'

const roleProfiles = {
  admin: {
    name: 'Avery Admin',
    email: 'avery.admin@example.test',
  },
  manager: {
    name: 'Morgan Manager',
    email: 'morgan.manager@example.test',
  },
  viewer: {
    name: 'Val Viewer',
    email: 'val.viewer@example.test',
  },
} as const

export function createSessionForRole(roleName: PrototypeRoleName): PrototypeSession {
  const role = prototypeRolePolicy.getRole(roleName)
  const profile = roleProfiles[role.role as keyof typeof roleProfiles] ?? {
    name: `${role.label ?? role.role} User`,
    email: `${role.role}@example.test`,
  }

  return createPrototypeSession({
    profile,
    role: role.role,
    permissions: role.permissions,
  })
}
