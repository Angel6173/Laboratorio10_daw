import type { EnrollmentCertificateResponse } from '../types/enrollment'

const API_BASE_URL =
  'https://sisacad-enrollments-backend.vercel.app/restful/enrollment-certificate/'

export async function fetchEnrollmentCertificate(
  cui: string,
): Promise<EnrollmentCertificateResponse> {
  const url = new URL(API_BASE_URL)
  url.searchParams.set('cui', cui)

  const response = await fetch(url.toString())

  if (!response.ok) {
    throw new Error(`Error al obtener la constancia: ${response.status}`)
  }

  return response.json() as Promise<EnrollmentCertificateResponse>
}
