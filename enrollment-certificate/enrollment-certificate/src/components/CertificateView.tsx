import type { EnrollmentCertificateResponse } from '../types/enrollment'
import { CoursesTable } from './CoursesTable'
import { StudentInfo } from './StudentInfo'

interface CertificateViewProps {
  data: EnrollmentCertificateResponse
}

function formatIssueDate(): string {
  return new Intl.DateTimeFormat('es-PE', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  }).format(new Date())
}

export function CertificateView({ data }: CertificateViewProps) {
  const student = data.results[0]?.student

  if (!student) {
    return (
      <div className="certificate-card">
        <p className="empty-message">
          No se encontraron matrículas para el C.U.I. consultado.
        </p>
      </div>
    )
  }

  return (
    <article className="certificate-card">
      <header className="certificate-header">
        <h1>CONSTANCIA DE MATRÍCULA DE LABORATORIO</h1>
        <p className="school-name">
          Escuela Profesional de Ingeniería de Sistemas EPIS
        </p>
        <p className="issue-date">Emitido el: {formatIssueDate()}</p>
      </header>

      <StudentInfo student={student} />
      <CoursesTable enrollments={data.results} total={data.count} />

      <footer className="certificate-footer">
        Documento generado digitalmente por el Sistema de Matrícula de
        Laboratorio EPIS
      </footer>
    </article>
  )
}
