import {
  extractBearerToken,
  verifyPrototypeJwt,
} from '@/app/shared/auth/prototype-token'
import { prototypePermissions } from '@/app/shared/auth/roles'
import { fakeProjects } from './fake-data'
import type { PrototypeApiRequest, PrototypeApiResponse } from '@/app/shared/api/client'
import type { PrototypeAccessTokenClaims } from '@/app/shared/auth/types'
import type { Project } from '@/app/features/projects/types'

let projects = [...fakeProjects]

export async function fakeBackend(
  request: PrototypeApiRequest,
): Promise<PrototypeApiResponse> {
  const claims = authenticate(request)

  if (request.method === 'GET' && request.path === '/dashboard') {
    requirePermission(claims, prototypePermissions.viewDashboard)
    return ok({
      activeProjects: projects.length,
      inReview: projects.filter((project) => project.status === 'review').length,
      atRisk: projects.filter((project) => project.health === 'at-risk').length,
      recentProjects: projects.slice(0, 3),
    } satisfies DashboardResponse)
  }

  if (request.method === 'GET' && request.path === '/projects') {
    requirePermission(claims, prototypePermissions.viewProjects)
    return ok({ projects })
  }

  if (request.method === 'POST' && request.path === '/projects') {
    requirePermission(claims, prototypePermissions.createProjects)
    const body = request.body as Partial<Project>
    const project: Project = {
      id: slugify(body.name ?? 'new-project'),
      name: body.name ?? 'New project',
      status: body.status ?? 'discovery',
      owner: claims.name,
      updatedAt: new Date().toISOString(),
      health: body.health ?? 'on-track',
      summary: body.summary ?? 'New prototype project.',
    }
    projects = [project, ...projects]
    return ok({ project }, 201)
  }

  const projectMatch = request.path.match(/^\/projects\/([^/]+)$/)
  if (request.method === 'GET' && projectMatch) {
    requirePermission(claims, prototypePermissions.viewProjects)
    const project = projects.find((item) => item.id === projectMatch[1])
    if (!project) {
      return json({ message: 'Project not found' }, 404)
    }
    return ok({ project })
  }

  return json({ message: 'Not found' }, 404)
}

export interface DashboardResponse {
  activeProjects: number
  inReview: number
  atRisk: number
  recentProjects: Project[]
}

function authenticate(request: PrototypeApiRequest): PrototypeAccessTokenClaims {
  const token = extractBearerToken(request.headers.Authorization)
  if (!token) {
    throw new Response('Missing bearer token', { status: 401 })
  }

  return verifyPrototypeJwt(token)
}

function requirePermission(
  claims: PrototypeAccessTokenClaims,
  permission: string,
): void {
  if (!claims.permissions.includes(permission)) {
    throw new Response('Forbidden', { status: 403 })
  }
}

function ok<T>(body: T, status = 200): PrototypeApiResponse<T> {
  return json(body, status)
}

function json<T>(body: T, status: number): PrototypeApiResponse<T> {
  return { status, body }
}

function slugify(value: string): string {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
}
