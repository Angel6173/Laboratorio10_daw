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
import { useTeachers, useUsers } from '../hooks/useResources'
import { useDebounce } from '../hooks/useDebounce'
import {
  useCreateTeacher,
  useDeleteTeacher,
  useUpdateTeacher,
} from '../hooks/useMutations'
import type { Teacher } from '../types/models'

const baseColumns: Column<Teacher>[] = [
  {
    key: 'fullname',
    header: 'Apellidos y nombres',
    className: 'cell-strong',
    render: (teacher) =>
      `${teacher.fatherSurname} ${teacher.motherSurname}, ${teacher.names}`,
  },
  {
    key: 'specialty',
    header: 'Especialidad',
    render: (teacher) => teacher.specialty ?? '—',
  },
  { key: 'phone', header: 'Teléfono', render: (teacher) => teacher.phone ?? '—' },
  {
    key: 'status',
    header: 'Estado',
    render: (teacher) => <StatusBadge status={teacher.status} />,
  },
]

function toValues(teacher: Teacher): Record<string, string> {
  return {
    names: teacher.names,
    fatherSurname: teacher.fatherSurname,
    motherSurname: teacher.motherSurname,
    specialty: teacher.specialty ?? '',
    phone: teacher.phone ?? '',
    gender: teacher.gender ?? '',
    user_id: teacher.user_id ?? '',
  }
}

export function TeachersPage() {
  const [search, setSearch] = useState('')
  const [createOpen, setCreateOpen] = useState(false)
  const [editing, setEditing] = useState<Teacher | null>(null)
  const create = useCreateTeacher()
  const update = useUpdateTeacher()
  const remove = useDeleteTeacher()
  const users = useUsers()
  const query = useTeachers(useDebounce(search))

  const fields: FormFieldDef[] = [
    { name: 'names', label: 'Nombres', required: true },
    { name: 'fatherSurname', label: 'Apellido paterno', required: true },
    { name: 'motherSurname', label: 'Apellido materno', required: true },
    { name: 'specialty', label: 'Especialidad' },
    { name: 'phone', label: 'Teléfono', placeholder: '+51 999888777' },
    {
      name: 'gender',
      label: 'Género',
      type: 'select',
      options: [
        { value: 'Masculino', label: 'Masculino' },
        { value: 'Femenino', label: 'Femenino' },
      ],
    },
    {
      name: 'user_id',
      label: 'Usuario (cuenta)',
      type: 'select',
      options: (users.data ?? [])
        .filter((user) => user.role === 'teacher')
        .map((user) => ({ value: user.id, label: user.email })),
    },
  ]

  const columns: Column<Teacher>[] = [
    ...baseColumns,
    {
      key: 'actions',
      header: 'Acciones',
      render: (teacher) => (
        <RowActions
          onEdit={() => {
            update.reset()
            setEditing(teacher)
          }}
          onDelete={() => handleDelete(teacher)}
        />
      ),
    },
  ]

  function handleDelete(teacher: Teacher) {
    if (
      window.confirm(
        `¿Eliminar al docente ${teacher.fatherSurname} ${teacher.motherSurname}, ${teacher.names}?`,
      )
    ) {
      remove.mutate(teacher.id)
    }
  }

  return (
    <>
      <div className="page-toolbar">
        <SearchBar
          value={search}
          onChange={setSearch}
          placeholder="Buscar por nombre o especialidad…"
        />
        <button
          className="btn-primary"
          onClick={() => {
            create.reset()
            setCreateOpen(true)
          }}
        >
          + Nuevo docente
        </button>
      </div>
      <ResourceView
        title="DOCENTES"
        query={query}
        columns={columns}
        rowKey={(teacher) => teacher.id}
      />
      {createOpen && (
        <CreateResourceModal
          title="Nuevo docente"
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
          title="Editar docente"
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
