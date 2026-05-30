import type {
  PrototypePermission,
  PrototypeRoleDefinition,
  PrototypeRoleName,
  PrototypeSession,
} from './types'
import { prototypeRoles } from './roles'

export interface PrototypeRolePolicy {
  roles: PrototypeRoleDefinition[]
  fallbackRole: PrototypeRoleName
  getRole(role?: PrototypeRoleName | null): PrototypeRoleDefinition
  permissionsForRole(role?: PrototypeRoleName | null): PrototypePermission[]
  hasPermission(session: PrototypeSession | null, permission: PrototypePermission): boolean
  requirePermission(session: PrototypeSession | null, permission: PrototypePermission): void
}

export class PrototypePermissionError extends Error {
  constructor(public readonly permission: PrototypePermission) {
    super(`Missing required permission: ${permission}`)
    this.name = 'PrototypePermissionError'
  }
}

export function createRolePolicy(
  roles: PrototypeRoleDefinition[],
  fallbackRole: PrototypeRoleName = 'viewer',
): PrototypeRolePolicy {
  const normalizedRoles = roles.length > 0 ? roles : [{ role: fallbackRole, permissions: [] }]
  const roleMap = new Map(normalizedRoles.map((role) => [role.role, role]))

  function getRole(role?: PrototypeRoleName | null): PrototypeRoleDefinition {
    return roleMap.get(role ?? '') ?? roleMap.get(fallbackRole) ?? normalizedRoles[0]!
  }

  function permissionsForRole(role?: PrototypeRoleName | null): PrototypePermission[] {
    return getRole(role).permissions
  }

  function hasPermission(
    session: PrototypeSession | null,
    permission: PrototypePermission,
  ): boolean {
    return session?.permissions.includes(permission) ?? false
  }

  function requirePermission(
    session: PrototypeSession | null,
    permission: PrototypePermission,
  ): void {
    if (!hasPermission(session, permission)) {
      throw new PrototypePermissionError(permission)
    }
  }

  return {
    roles: normalizedRoles,
    fallbackRole,
    getRole,
    permissionsForRole,
    hasPermission,
    requirePermission,
  }
}

export const prototypeRolePolicy = createRolePolicy(prototypeRoles)
