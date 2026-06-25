import { useQuery } from '@tanstack/react-query'
import { fetchEnrollmentCertificate } from '../api/enrollmentApi'

export function useEnrollmentCertificate(cui: string) {
  return useQuery({
    queryKey: ['enrollment-certificate', cui],
    queryFn: () => fetchEnrollmentCertificate(cui),
    enabled: Boolean(cui),
    staleTime: 1000 * 60 * 5,
  })
}
