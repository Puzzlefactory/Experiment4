export type ProjectStatus = 'discovery' | 'build' | 'review' | 'shipped'
export type ProjectHealth = 'on-track' | 'watch' | 'at-risk'

export interface Project {
  id: string
  name: string
  status: ProjectStatus
  owner: string
  updatedAt: string
  health: ProjectHealth
  summary: string
}
