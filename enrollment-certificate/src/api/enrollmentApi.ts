import type { EnrollmentCertificateResponse } from '../types/enrollment'
import { getAccessToken, clearTokens } from './authApi'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? 'http://127.0.0.1:8000'

export async function fetchEnrollmentCertificate(
  studentId: string,
): Promise<EnrollmentCertificateResponse> {
  const url = new URL(`${API_BASE_URL}/api/enrollment-certificate/`)
  url.searchParams.set('student_id', studentId)

  const token = getAccessToken()
  const response = await fetch(url.toString(), {
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  })

  if (response.status === 401) {
    clearTokens()
    window.location.href = '/login'
    throw new Error('Sesión expirada. Por favor inicie sesión nuevamente.')
  }

  if (!response.ok) {
    throw new Error(`Error al obtener la constancia: ${response.status}`)
  }

  return response.json() as Promise<EnrollmentCertificateResponse>
}
