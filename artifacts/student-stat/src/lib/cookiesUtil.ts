import Cookies from 'js-cookie'

const ACCESS_TOKEN_KEY = 'rextra_access_token'
const REFRESH_TOKEN_KEY = 'rextra_refresh_token'

export const getAccessToken = (): string | undefined =>
  Cookies.get(ACCESS_TOKEN_KEY)

export const getRefreshToken = (): string | undefined =>
  Cookies.get(REFRESH_TOKEN_KEY)

export const setAccessToken = (token: string) => {
  Cookies.set(ACCESS_TOKEN_KEY, token, { path: '/', sameSite: 'none', secure: true })
}

export const setRefreshToken = (token: string) => {
  Cookies.set(REFRESH_TOKEN_KEY, token, { path: '/', sameSite: 'none', secure: true })
}

export const removeTokens = () => {
  Cookies.remove(ACCESS_TOKEN_KEY, { path: '/' })
  Cookies.remove(REFRESH_TOKEN_KEY, { path: '/' })
}
