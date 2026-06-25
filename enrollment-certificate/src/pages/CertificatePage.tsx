import { useParams } from 'react-router-dom'
import { CertificateView } from '../components/CertificateView'
import { useEnrollmentCertificate } from '../hooks/useEnrollmentCertificate'

export function CertificatePage() {
  const { studentId = '' } = useParams<{ studentId: string }>()
  const { data, isLoading, isError, error } = useEnrollmentCertificate(studentId)

  if (!studentId) {
    return (
      <div className="page-state">
        <p>Debe indicar el ID del estudiante en la URL, por ejemplo: /constancia/uuid</p>
      </div>
    )
  }

  if (isLoading) {
    return <div className="page-state">Cargando constancia...</div>
  }

  if (isError) {
    return (
      <div className="page-state error">
        {(error as Error).message || 'No fue posible cargar la constancia.'}
      </div>
    )
  }

  if (!data) {
    return <div className="page-state">Sin datos disponibles.</div>
  }

  return <CertificateView data={data} />
}
