import type { PrototypeSession } from './types'

export interface PrototypeSessionStorage {
  getItem(key: string): string | null
  setItem(key: string, value: string): void
  removeItem(key: string): void
}

export const defaultPrototypeSessionKey = 'prototype.auth.session'

export function getBrowserSessionStorage(): PrototypeSessionStorage | null {
  return typeof globalThis.localStorage === 'undefined' ? null : globalThis.localStorage
}

export function loadPrototypeSession(
  storage: PrototypeSessionStorage | null = getBrowserSessionStorage(),
  key = defaultPrototypeSessionKey,
): PrototypeSession | null {
  if (!storage) {
    return null
  }

  const rawSession = storage.getItem(key)
  if (!rawSession) {
    return null
  }

  try {
    return JSON.parse(rawSession) as PrototypeSession
  } catch {
    storage.removeItem(key)
    return null
  }
}

export function savePrototypeSession(
  session: PrototypeSession,
  storage: PrototypeSessionStorage | null = getBrowserSessionStorage(),
  key = defaultPrototypeSessionKey,
): void {
  storage?.setItem(key, JSON.stringify(session))
}

export function clearPrototypeSession(
  storage: PrototypeSessionStorage | null = getBrowserSessionStorage(),
  key = defaultPrototypeSessionKey,
): void {
  storage?.removeItem(key)
}
