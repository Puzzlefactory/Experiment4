import type { Project, ProjectStatus } from '@/app/features/projects/types'

export const projectStatusLabels: Record<ProjectStatus, string> = {
  discovery: 'Discovery',
  build: 'Build',
  review: 'Review',
  shipped: 'Shipped',
}

export const fakeProjects: Project[] = [
  {
    id: 'atlas',
    name: 'Atlas Customer Portal',
    status: 'build',
    owner: 'Morgan Manager',
    updatedAt: '2026-05-23T14:30:00.000Z',
    health: 'on-track',
    summary: 'Self-service portal prototype with tenant-aware navigation.',
  },
  {
    id: 'beacon',
    name: 'Beacon Ops Console',
    status: 'review',
    owner: 'Avery Admin',
    updatedAt: '2026-05-25T16:10:00.000Z',
    health: 'watch',
    summary: 'Operational workspace for exceptions, queues, and approvals.',
  },
  {
    id: 'cinder',
    name: 'Cinder Partner Hub',
    status: 'discovery',
    owner: 'Val Viewer',
    updatedAt: '2026-05-27T11:45:00.000Z',
    health: 'at-risk',
    summary: 'Partner onboarding and catalog management exploration.',
  },
]
