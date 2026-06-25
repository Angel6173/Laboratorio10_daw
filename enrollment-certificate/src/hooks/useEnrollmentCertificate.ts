import { useQuery } from '@tanstack/react-query'
import { fetchEnrollmentCertificate } from '../api/enrollmentApi'

export function useEnrollmentCertificate(studentId: string) {
  return useQuery({
    queryKey: ['enrollment-certificate', studentId],
    queryFn: () => fetchEnrollmentCertificate(studentId),
    enabled: Boolean(studentId),
    staleTime: 1000 * 60 * 5,
    retry: false,
  })
}
