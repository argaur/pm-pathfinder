// ============================================================
// Anonymous session helpers
// Session token stored in localStorage, used pre-auth
// ============================================================

export const SESSION_TOKEN_KEY = 'pm_pathfinder_session_token'
export const ONBOARDING_KEY = 'pm_pathfinder_onboarding'
export const DIAGNOSTIC_ANSWERS_KEY = 'pm_pathfinder_diagnostic'

export function getSessionToken(): string | null {
  if (typeof window === 'undefined') return null
  return localStorage.getItem(SESSION_TOKEN_KEY)
}

export function setSessionToken(token: string): void {
  if (typeof window === 'undefined') return
  localStorage.setItem(SESSION_TOKEN_KEY, token)
}

export function generateSessionToken(): string {
  return `sess_${crypto.randomUUID()}`
}

export function getOrCreateSessionToken(): string {
  const existing = getSessionToken()
  if (existing) return existing
  const token = generateSessionToken()
  setSessionToken(token)
  return token
}

export function clearSession(): void {
  if (typeof window === 'undefined') return
  localStorage.removeItem(SESSION_TOKEN_KEY)
  localStorage.removeItem(ONBOARDING_KEY)
  localStorage.removeItem(DIAGNOSTIC_ANSWERS_KEY)
}

// Onboarding answers (stored locally as backup)
export interface OnboardingAnswers {
  background: string
  yearsExperience: string
  industry: string
}

export function saveOnboardingAnswers(answers: OnboardingAnswers): void {
  if (typeof window === 'undefined') return
  localStorage.setItem(ONBOARDING_KEY, JSON.stringify(answers))
}

export function getOnboardingAnswers(): OnboardingAnswers | null {
  if (typeof window === 'undefined') return null
  const raw = localStorage.getItem(ONBOARDING_KEY)
  if (!raw) return null
  try {
    return JSON.parse(raw) as OnboardingAnswers
  } catch {
    return null
  }
}

// Diagnostic answers
export function saveDiagnosticAnswers(answers: Record<string, string>): void {
  if (typeof window === 'undefined') return
  localStorage.setItem(DIAGNOSTIC_ANSWERS_KEY, JSON.stringify(answers))
}

export function getDiagnosticAnswers(): Record<string, string> | null {
  if (typeof window === 'undefined') return null
  const raw = localStorage.getItem(DIAGNOSTIC_ANSWERS_KEY)
  if (!raw) return null
  try {
    return JSON.parse(raw)
  } catch {
    return null
  }
}
