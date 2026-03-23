import { getAccessToken, removeTokens } from './cookiesUtil'

function parseJwt(token: string) {
  try {
    return JSON.parse(atob(token.split('.')[1]))
  } catch {
    return null
  }
}

export function isAuthenticated() {
  const token = getAccessToken()
  if (!token) return false

  const payload = parseJwt(token)
  if (!payload?.exp) return false

  const isExpired = payload.exp * 1000 < Date.now()
  if (isExpired) {
    removeTokens()
    return false
  }

  return true
}
