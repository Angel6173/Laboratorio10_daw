import { useState } from 'react'
import type { Column } from '../components/DataTable'
import { ResourceView } from '../components/ResourceView'
import { StatusBadge } from '../components/StatusBadge'
import { SearchBar } from '../components/SearchBar'
import {
  CreateResourceModal,
  type FormFieldDef,
} from '../components/CreateResourceModal'
import { useCourses, useTeachers } from '../hooks/useResources'
import { useDebounce } from '../hooks/useDebounce'
import { useCreateCourse } from '../hooks/useMutations'
import type { Course } from '../types/models'

const columns: Column<Course>[] = [
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

export function CoursesPage() {
  const [search, setSearch] = useState('')
  const [open, setOpen] = useState(false)
  const create = useCreateCourse()
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
          placeholder="Buscar curso…"
        />
        <button className="btn-primary" onClick={() => setOpen(true)}>
          + Nuevo curso
        </button>
      </div>
      <ResourceView
        title="CURSOS"
        query={query}
        columns={columns}
        rowKey={(course) => course.id}
      />
      {open && (
        <CreateResourceModal
          title="Nuevo curso"
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
