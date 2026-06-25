import type { EnrollmentResult } from '../types/enrollment'
import { SectionHeader } from './SectionHeader'

interface CoursesTableProps {
  enrollments: EnrollmentResult[]
  total: number
}

export function CoursesTable({ enrollments, total }: CoursesTableProps) {
  return (
    <section className="certificate-section">
      <SectionHeader title="ASIGNATURAS MATRICULADAS" />
      <div className="table-wrapper">
        <table className="courses-table">
          <thead>
            <tr>
              <th>N°</th>
              <th>Código</th>
              <th>Curso</th>
              <th>Año</th>
              <th>Grupo</th>
              <th>Laboratorio</th>
              <th>Docente</th>
            </tr>
          </thead>
          <tbody>
            {enrollments.map((enrollment, index) => {
              const { course, group, laboratory, teacher } = enrollment.workload
              const courseLabel = `${course.name} (${course.acronym})`

              return (
                <tr key={enrollment.id}>
                  <td>{index + 1}</td>
                  <td>{course.code}</td>
                  <td className="course-name">{courseLabel}</td>
                  <td>{course.year_display}</td>
                  <td>{group}</td>
                  <td>{laboratory}</td>
                  <td>{teacher.full_name}</td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
      <p className="total-courses">
        Total de cursos matriculados: <strong>{total}</strong>
      </p>
    </section>
  )
}
