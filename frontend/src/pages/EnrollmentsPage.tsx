import { useState } from 'react'
import type { Column } from '../components/DataTable'
import { ResourceView } from '../components/ResourceView'
import { StatusBadge } from '../components/StatusBadge'
import { SearchBar } from '../components/SearchBar'
import {
  CreateResourceModal,
  type FormFieldDef,
} from '../components/CreateResourceModal'
import { useCourses, useEnrollments, useStudents } from '../hooks/useResources'
import { useDebounce } from '../hooks/useDebounce'
import { useCreateEnrollment } from '../hooks/useMutations'
import type { CourseStudent } from '../types/models'

const columns: Column<CourseStudent>[] = [
  {
    key: 'student',
    header: 'ID Estudiante',
    className: 'cell-mono',
    render: (enrollment) => enrollment.student,
  },
  {
    key: 'course',
    header: 'ID Curso',
    className: 'cell-mono',
    render: (enrollment) => enrollment.course,
  },
  {
    key: 'enrollmentDate',
    header: 'Fecha de matrícula',
    render: (enrollment) =>
      new Date(enrollment.enrollmentDate).toLocaleString('es-PE'),
  },
  {
    key: 'status',
    header: 'Estado',
    render: (enrollment) => <StatusBadge status={enrollment.status} />,
  },
]

export function EnrollmentsPage() {
  const [search, setSearch] = useState('')
  const [open, setOpen] = useState(false)
  const create = useCreateEnrollment()
  const students = useStudents()
  const courses = useCourses()
  const query = useEnrollments(useDebounce(search))

  const fields: FormFieldDef[] = [
    {
      name: 'student',
      label: 'Estudiante',
      type: 'select',
      required: true,
      options: (students.data ?? []).map((student) => ({
        value: student.id,
        label: `${student.fatherSurname} ${student.motherSurname}, ${student.names}`,
      })),
    },
    {
      name: 'course',
      label: 'Curso',
      type: 'select',
      required: true,
      options: (courses.data ?? []).map((course) => ({
        value: course.id,
        label: course.courseName,
      })),
    },
  ]

  function handleClose() {
    setOpen(false)
    create.reset()
  }

  function handleSubmit(data: Record<string, string>) {
    create.mutate(data, { onSuccess: handleClose })
  }

  return (
    <>
      <div className="page-toolbar">
        <SearchBar
          value={search}
          onChange={setSearch}
          placeholder="Buscar por estudiante o curso…"
        />
        <button className="btn-primary" onClick={() => setOpen(true)}>
          + Nueva matrícula
        </button>
      </div>
      <ResourceView
        title="MATRÍCULAS"
        query={query}
        columns={columns}
        rowKey={(enrollment) => enrollment.id}
      />
      {open && (
        <CreateResourceModal
          title="Nueva matrícula"
          fields={fields}
          isPending={create.isPending}
          error={create.error}
          onClose={handleClose}
          onSubmit={handleSubmit}
        />
      )}
    </>
  )
}
