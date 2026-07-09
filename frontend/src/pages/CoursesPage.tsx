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
import { useCourses, useTeachers } from '../hooks/useResources'
import { useDebounce } from '../hooks/useDebounce'
import {
  useCreateCourse,
  useDeleteCourse,
  useUpdateCourse,
} from '../hooks/useMutations'
import type { Course } from '../types/models'

const baseColumns: Column<Course>[] = [
  { key: 'courseName', header: 'Curso', className: 'cell-strong' },
  { key: 'credits', header: 'Créditos' },
  {
    key: 'description',
    header: 'Descripción',
    render: (course) => course.description ?? '—',
  },
  {
    key: 'status',
    header: 'Estado',
    render: (course) => <StatusBadge status={course.status} />,
  },
]

function toValues(course: Course): Record<string, string> {
  return {
    courseName: course.courseName,
    credits: String(course.credits),
    description: course.description ?? '',
    teacher_id: course.teacher_id ?? '',
  }
}

export function CoursesPage() {
  const [search, setSearch] = useState('')
  const [createOpen, setCreateOpen] = useState(false)
  const [editing, setEditing] = useState<Course | null>(null)
  const create = useCreateCourse()
  const update = useUpdateCourse()
  const remove = useDeleteCourse()
  const teachers = useTeachers()
  const query = useCourses(useDebounce(search))

  const fields: FormFieldDef[] = [
    { name: 'courseName', label: 'Nombre del curso', required: true },
    { name: 'credits', label: 'Créditos', type: 'number', required: true },
    { name: 'description', label: 'Descripción' },
    {
      name: 'teacher_id',
      label: 'Docente',
      type: 'select',
      options: (teachers.data ?? []).map((teacher) => ({
        value: teacher.id,
        label: `${teacher.fatherSurname} ${teacher.motherSurname}, ${teacher.names}`,
      })),
    },
  ]

  const columns: Column<Course>[] = [
    ...baseColumns,
    {
      key: 'actions',
      header: 'Acciones',
      render: (course) => (
        <RowActions
          onEdit={() => {
            update.reset()
            setEditing(course)
          }}
          onDelete={() => handleDelete(course)}
        />
      ),
    },
  ]

  function handleDelete(course: Course) {
    if (window.confirm(`¿Eliminar el curso "${course.courseName}"?`)) {
      remove.mutate(course.id)
    }
  }

  return (
    <>
      <div className="page-toolbar">
        <SearchBar
          value={search}
          onChange={setSearch}
          placeholder="Buscar curso…"
        />
        <button
          className="btn-primary"
          onClick={() => {
            create.reset()
            setCreateOpen(true)
          }}
        >
          + Nuevo curso
        </button>
      </div>
      <ResourceView
        title="CURSOS"
        query={query}
        columns={columns}
        rowKey={(course) => course.id}
      />
      {createOpen && (
        <CreateResourceModal
          title="Nuevo curso"
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
          title="Editar curso"
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
