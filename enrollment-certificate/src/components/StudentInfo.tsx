import type { Student } from '../types/enrollment'
import { SectionHeader } from './SectionHeader'

interface StudentInfoProps {
  student: Student
}

export function StudentInfo({ student }: StudentInfoProps) {
  return (
    <section className="certificate-section">
      <SectionHeader title="DATOS DEL ALUMNO" />
      <dl className="info-grid">
        <div className="info-row">
          <dt>ID Estudiante</dt>
          <dd className="student-id">{student.cui}</dd>
        </div>
        <div className="info-row">
          <dt>Nombre completo</dt>
          <dd>{student.full_name}</dd>
        </div>
        <div className="info-row">
          <dt>Email</dt>
          <dd>{student.email}</dd>
        </div>
      </dl>
    </section>
  )
}
