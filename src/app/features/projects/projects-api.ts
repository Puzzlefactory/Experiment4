import { z } from 'zod'
import { prototypeApi } from '@/app/shared/api/prototype-api'
import type { Project } from './types'

export const createProjectSchema = z.object({
  name: z.string().min(2, 'Give the project a useful name.'),
  summary: z.string().min(8, 'Summaries should explain the intent.'),
})

export async function listProjects(): Promise<Project[]> {
  const response = await prototypeApi.get<{ projects: Project[] }>('/projects')
  return response.projects
}

export async function getProject(projectId: string): Promise<Project> {
  const response = await prototypeApi.get<{ project: Project }>(
    `/projects/${projectId}`,
  )
  return response.project
}

export async function createProject(input: z.infer<typeof createProjectSchema>) {
  const response = await prototypeApi.post<{ project: Project }>('/projects', {
    name: input.name,
    summary: input.summary,
  })

  return response.project
}
