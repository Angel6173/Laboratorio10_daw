import { useState } from 'react'
import type { Column } from '../components/DataTable'
import { ResourceView } from '../components/ResourceView'
import { StatusBadge } from '../components/StatusBadge'
import { SearchBar } from '../components/SearchBar'
import { RowActions } from '../components/RowActions'
import {
  CreateResourceModal,
  type FormFieldDef,
} from '../components/CreateResourceModal'
import { useCourses, useEnrollments, useStudents } from '../hooks/useResources'
import { useDebounce } from '../hooks/useDebounce'
import {
  useCreateEnrollment,
  useDeleteEnrollment,
  useUpdateEnrollment,
} from '../hooks/useMutations'
import type { CourseStudent } from '../types/models'

const baseColumns: Column<CourseStudent>[] = [
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

function toValues(enrollment: CourseStudent): Record<string, string> {
  return {
    student: enrollment.student,
    course: enrollment.course,
  }
}

export function EnrollmentsPage() {
  const [search, setSearch] = useState('')
  const [createOpen, setCreateOpen] = useState(false)
  const [editing, setEditing] = useState<CourseStudent | null>(null)
  const create = useCreateEnrollment()
  const update = useUpdateEnrollment()
  const remove = useDeleteEnrollment()
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

  const columns: Column<CourseStudent>[] = [
    ...baseColumns,
    {
      key: 'actions',
      header: 'Acciones',
      render: (enrollment) => (
        <RowActions
          onEdit={() => {
            update.reset()
            setEditing(enrollment)
          }}
          onDelete={() => handleDelete(enrollment)}
        />
      ),
    },
  ]

  function handleDelete(enrollment: CourseStudent) {
    if (window.confirm('¿Eliminar esta matrícula?')) {
      remove.mutate(enrollment.id)
    }
  }

  return (
    <>
      <div className="page-toolbar">
        <SearchBar
          value={search}
          onChange={setSearch}
          placeholder="Buscar por estudiante o curso…"
        />
        <button
          className="btn-primary"
          onClick={() => {
            create.reset()
            setCreateOpen(true)
          }}
        >
          + Nueva matrícula
        </button>
      </div>
      <ResourceView
        title="MATRÍCULAS"
        query={query}
        columns={columns}
        rowKey={(enrollment) => enrollment.id}
      />
      {createOpen && (
        <CreateResourceModal
          title="Nueva matrícula"
          fields={fields}
          isPending={create.isPending}
          error={create.error}
          onClose={() => setCreateOpen(false)}
          onSubmit={(data) =>
            create.mutate(data, { onSuccess: () => setCreateOpen(false) })
          }
        />
      )}
      {editing && (
        <CreateResourceModal
          key={editing.id}
          title="Editar matrícula"
          fields={fields}
          initialValues={toValues(editing)}
          isPending={update.isPending}
          error={update.error}
          onClose={() => setEditing(null)}
          onSubmit={(data) =>
            update.mutate(
              { id: editing.id, data },
              { onSuccess: () => setEditing(null) },
            )
          }
        />
      )}
    </>
  )
}
