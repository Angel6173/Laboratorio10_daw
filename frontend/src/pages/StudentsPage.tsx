import { useState } from 'react'
import { Link } from 'react-router-dom'
import type { Column } from '../components/DataTable'
import { ResourceView } from '../components/ResourceView'
import { StatusBadge } from '../components/StatusBadge'
import { SearchBar } from '../components/SearchBar'
import { RowActions } from '../components/RowActions'
import {
  CreateResourceModal,
  type FormFieldDef,
} from '../components/CreateResourceModal'
import { useStudents, useUsers } from '../hooks/useResources'
import { useDebounce } from '../hooks/useDebounce'
import {
  useCreateStudent,
  useDeleteStudent,
  useUpdateStudent,
} from '../hooks/useMutations'
import type { Student } from '../types/models'

const baseColumns: Column<Student>[] = [
  {
    key: 'fullname',
    header: 'Apellidos y nombres',
    className: 'cell-strong',
    render: (student) =>
      `${student.fatherSurname} ${student.motherSurname}, ${student.names}`,
  },
  { key: 'gender', header: 'Género', render: (student) => student.gender ?? '—' },
  { key: 'phone', header: 'Teléfono', render: (student) => student.phone ?? '—' },
  {
    key: 'status',
    header: 'Estado',
    render: (student) => <StatusBadge status={student.status} />,
  },
  {
    key: 'certificate',
    header: 'Constancia',
    render: (student) => (
      <Link to={`/constancia/${student.id}`} className="row-action">
        Ver constancia
      </Link>
    ),
  },
]

function toValues(student: Student): Record<string, string> {
  return {
    names: student.names,
    fatherSurname: student.fatherSurname,
    motherSurname: student.motherSurname,
    gender: student.gender ?? '',
    phone: student.phone ?? '',
    address: student.address ?? '',
    user_id: student.user_id ?? '',
  }
}

export function StudentsPage() {
  const [search, setSearch] = useState('')
  const [createOpen, setCreateOpen] = useState(false)
  const [editing, setEditing] = useState<Student | null>(null)
  const create = useCreateStudent()
  const update = useUpdateStudent()
  const remove = useDeleteStudent()
  const users = useUsers()
  const query = useStudents(useDebounce(search))

  const fields: FormFieldDef[] = [
    { name: 'names', label: 'Nombres', required: true },
    { name: 'fatherSurname', label: 'Apellido paterno', required: true },
    { name: 'motherSurname', label: 'Apellido materno', required: true },
    {
      name: 'gender',
      label: 'Género',
      type: 'select',
      options: [
        { value: 'Masculino', label: 'Masculino' },
        { value: 'Femenino', label: 'Femenino' },
      ],
    },
    { name: 'phone', label: 'Teléfono', placeholder: 'mínimo 9 dígitos' },
    { name: 'address', label: 'Dirección' },
    {
      name: 'user_id',
      label: 'Usuario (cuenta)',
      type: 'select',
      options: (users.data ?? [])
        .filter((user) => user.role === 'student')
        .map((user) => ({ value: user.id, label: user.email })),
    },
  ]

  const columns: Column<Student>[] = [
    ...baseColumns,
    {
      key: 'actions',
      header: 'Acciones',
      render: (student) => (
        <RowActions
          onEdit={() => {
            update.reset()
            setEditing(student)
          }}
          onDelete={() => handleDelete(student)}
        />
      ),
    },
  ]

  function handleDelete(student: Student) {
    if (
      window.confirm(
        `¿Eliminar a ${student.fatherSurname} ${student.motherSurname}, ${student.names}?`,
      )
    ) {
      remove.mutate(student.id)
    }
  }

  return (
    <>
      <div className="page-toolbar">
        <SearchBar
          value={search}
          onChange={setSearch}
          placeholder="Buscar por nombre o apellido…"
        />
        <button
          className="btn-primary"
          onClick={() => {
            create.reset()
            setCreateOpen(true)
          }}
        >
          + Nuevo estudiante
        </button>
      </div>
      <ResourceView
        title="ESTUDIANTES"
        query={query}
        columns={columns}
        rowKey={(student) => student.id}
      />
      {createOpen && (
        <CreateResourceModal
          title="Nuevo estudiante"
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
          title="Editar estudiante"
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
