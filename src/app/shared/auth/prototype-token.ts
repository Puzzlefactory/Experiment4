import type {
  CreatePrototypeSessionInput,
  PrototypeAccessTokenClaims,
  PrototypeSession,
} from './types'

export interface VerifyPrototypeJwtOptions {
  audience?: string
  issuer?: string
  now?: Date
  clockToleranceSeconds?: number
}

const defaultIssuer = 'https://prototype.auth.local/'
const defaultAudience = 'prototype-api'

export function createPrototypeSession(
  input: CreatePrototypeSessionInput,
): PrototypeSession {
  const now = input.now ?? new Date()
  const iat = Math.floor(now.getTime() / 1000)
  const ttlSeconds = input.ttlSeconds ?? 60 * 60
  const exp = iat + ttlSeconds
  const userId = createPrototypeSubject(input.profile.email)

  const claims: PrototypeAccessTokenClaims = {
    sub: userId,
    name: input.profile.name,
    email: input.profile.email,
    permissions: input.permissions,
    scope: input.permissions.join(' '),
    iss: input.issuer ?? defaultIssuer,
    aud: input.audience ?? defaultAudience,
    iat,
    exp,
    'https://prototype.local/roles': [input.role],
  }

  return {
    user: {
      id: userId,
      name: input.profile.name,
      email: input.profile.email,
      role: input.role,
    },
    permissions: input.permissions,
    accessToken: encodePrototypeJwt(claims),
    claims,
    expiresAt: new Date(exp * 1000).toISOString(),
  }
}

export function verifyPrototypeJwt(
  token: string,
  options: VerifyPrototypeJwtOptions = {},
): PrototypeAccessTokenClaims {
  const claims = decodePrototypeJwt(token)
  const now = Math.floor((options.now ?? new Date()).getTime() / 1000)
  const tolerance = options.clockToleranceSeconds ?? 0

  if (claims.iss !== (options.issuer ?? defaultIssuer)) {
    throw new Error('Invalid prototype token issuer')
  }

  if (claims.aud !== (options.audience ?? defaultAudience)) {
    throw new Error('Invalid prototype token audience')
  }

  if (claims.exp + tolerance < now) {
    throw new Error('Prototype token expired')
  }

  return claims
}

export function extractBearerToken(
  authorizationHeader: string | null | undefined,
): string | null {
  if (!authorizationHeader?.startsWith('Bearer ')) {
    return null
  }

  return authorizationHeader.slice('Bearer '.length).trim() || null
}

export function encodePrototypeJwt(claims: PrototypeAccessTokenClaims): string {
  const header = { alg: 'prototype', typ: 'JWT' }
  const encodedHeader = base64UrlEncode(JSON.stringify(header))
  const encodedClaims = base64UrlEncode(JSON.stringify(claims))
  const signature = base64UrlEncode(`prototype-signature:${claims.sub}:${claims.iat}`)

  return `${encodedHeader}.${encodedClaims}.${signature}`
}

export function decodePrototypeJwt(token: string): PrototypeAccessTokenClaims {
  const [, claims] = token.split('.')
  if (!claims) {
    throw new Error('Invalid prototype token format')
  }

  return JSON.parse(base64UrlDecode(claims)) as PrototypeAccessTokenClaims
}

function createPrototypeSubject(email: string): string {
  return `auth0|prototype-${base64UrlEncode(email.toLowerCase()).slice(0, 16)}`
}

function base64UrlEncode(value: string): string {
  return globalThis
    .btoa(value)
    .replaceAll('+', '-')
    .replaceAll('/', '_')
    .replaceAll('=', '')
}

function base64UrlDecode(value: string): string {
  const base64 = value.replaceAll('-', '+').replaceAll('_', '/')
  const padded = base64.padEnd(Math.ceil(base64.length / 4) * 4, '=')

  return globalThis.atob(padded)
}
