import { useParams } from 'react-router-dom'
import { CertificateView } from '../components/CertificateView'
import { useEnrollmentCertificate } from '../hooks/useEnrollmentCertificate'

export function CertificatePage() {
  const { cui = '' } = useParams<{ cui: string }>()
  const { data, isLoading, isError, error } = useEnrollmentCertificate(cui)

  if (!cui) {
    return (
      <div className="page-state">
        <p>Debe indicar un C.U.I. en la URL, por ejemplo: /constancia/20250100</p>
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
