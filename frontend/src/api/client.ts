import {
  API_BASE_URL,
  clearTokens,
  getAccessToken,
  refreshAccessToken,
} from './authApi'

export async function apiFetch<T>(
  path: string,
  options: RequestInit = {},
  retry = true,
): Promise<T> {
  const token = getAccessToken()

  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(options.headers ?? {}),
    },
  })

  if (response.status === 401 && retry) {
    const refreshed = await refreshAccessToken()
    if (refreshed) {
      return apiFetch<T>(path, options, false)
    }
    clearTokens()
    if (window.location.pathname !== '/login') {
      window.location.href = '/login'
    }
    throw new Error('Sesión expirada. Vuelve a iniciar sesión.')
  }

  if (!response.ok) {
    let message = `Error ${response.status}`
    try {
      const body = await response.json()
      if (body?.detail) {
        message = body.detail
      } else if (body && typeof body === 'object') {
        const parts = Object.entries(body).map(
          ([field, msgs]) =>
            `${field}: ${Array.isArray(msgs) ? msgs.join(' ') : msgs}`,
        )
        if (parts.length) message = parts.join(' · ')
      }
    } catch {}
    throw new Error(message)
  }

  return response.json() as Promise<T>
}
