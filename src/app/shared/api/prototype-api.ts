import { loadPrototypeSession } from '@/app/shared/auth/session-storage'
import { createPrototypeApiClient } from './client'
import { fakeBackend } from '@/app/shared/backend/fake-backend'
import { createSessionForRole } from '@/app/shared/auth/session-factory'

export const prototypeApi = createPrototypeApiClient({
  getAccessToken: () =>
    loadPrototypeSession()?.accessToken ?? createSessionForRole('viewer').accessToken,
  handler: fakeBackend,
})
