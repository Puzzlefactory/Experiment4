export type PrototypeRoleName = string
export type PrototypePermission = string

export interface PrototypeUserProfile {
  name: string
  email: string
}

export interface PrototypeRoleDefinition {
  role: PrototypeRoleName
  label?: string
  description?: string
  permissions: PrototypePermission[]
}

export interface PrototypeSessionUser extends PrototypeUserProfile {
  id: string
  role: PrototypeRoleName
}

export interface PrototypeAccessTokenClaims {
  sub: string
  name: string
  email: string
  permissions: PrototypePermission[]
  scope: string
  iss: string
  aud: string
  iat: number
  exp: number
  'https://prototype.local/roles': PrototypeRoleName[]
}

export interface PrototypeSession {
  user: PrototypeSessionUser
  permissions: PrototypePermission[]
  accessToken: string
  claims: PrototypeAccessTokenClaims
  expiresAt: string
}

export interface CreatePrototypeSessionInput {
  profile: PrototypeUserProfile
  role: PrototypeRoleName
  permissions: PrototypePermission[]
  audience?: string
  issuer?: string
  ttlSeconds?: number
  now?: Date
}
