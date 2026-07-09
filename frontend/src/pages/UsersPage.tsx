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
import { useUsers } from '../hooks/useResources'
import { useDebounce } from '../hooks/useDebounce'
import {
  useCreateUser,
  useDeleteUser,
  useUpdateUser,
} from '../hooks/useMutations'
import type { User } from '../types/models'

const baseColumns: Column<User>[] = [
  { key: 'email', header: 'Email', className: 'cell-strong' },
  {
    key: 'role',
    header: 'Rol',
    render: (user) => <span className="tag">{user.role}</span>,
  },
  {
    key: 'status',
    header: 'Estado',
    render: (user) => <StatusBadge status={user.status} />,
  },
]

const roleOptions = [
  { value: 'admin', label: 'Admin' },
  { value: 'teacher', label: 'Docente' },
  { value: 'student', label: 'Estudiante' },
]

const statusOptions = [
  { value: 'active', label: 'Activo' },
  { value: 'inactive', label: 'Inactivo' },
  { value: 'suspended', label: 'Suspendido' },
]

const createFields: FormFieldDef[] = [
  { name: 'email', label: 'Email', type: 'email', required: true },
  { name: 'password', label: 'Contraseña', type: 'password', required: true },
  { name: 'role', label: 'Rol', type: 'select', required: true, options: roleOptions },
  { name: 'status', label: 'Estado', type: 'select', options: statusOptions },
]

const editFields: FormFieldDef[] = [
  { name: 'email', label: 'Email', type: 'email', required: true },
  {
    name: 'password',
    label: 'Contraseña',
    type: 'password',
    placeholder: 'dejar en blanco para no cambiar',
  },
  { name: 'role', label: 'Rol', type: 'select', required: true, options: roleOptions },
  { name: 'status', label: 'Estado', type: 'select', options: statusOptions },
]

function toValues(user: User): Record<string, string> {
  return { email: user.email, role: user.role, status: user.status }
}

export function UsersPage() {
  const [search, setSearch] = useState('')
  const [createOpen, setCreateOpen] = useState(false)
  const [editing, setEditing] = useState<User | null>(null)
  const create = useCreateUser()
  const update = useUpdateUser()
  const remove = useDeleteUser()
  const query = useUsers(useDebounce(search))

  const columns: Column<User>[] = [
    ...baseColumns,
    {
      key: 'actions',
      header: 'Acciones',
      render: (user) => (
        <RowActions
          onEdit={() => {
            update.reset()
            setEditing(user)
          }}
          onDelete={() => handleDelete(user)}
        />
      ),
    },
  ]

  function handleDelete(user: User) {
    if (window.confirm(`¿Eliminar el usuario ${user.email}?`)) {
      remove.mutate(user.id)
    }
  }

  return (
    <>
      <div className="page-toolbar">
        <SearchBar
          value={search}
          onChange={setSearch}
          placeholder="Buscar por email…"
        />
        <button
          className="btn-primary"
          onClick={() => {
            create.reset()
            setCreateOpen(true)
          }}
        >
          + Nuevo usuario
        </button>
      </div>
      <ResourceView
        title="USUARIOS"
        query={query}
        columns={columns}
        rowKey={(user) => user.id}
      />
      {createOpen && (
        <CreateResourceModal
          title="Nuevo usuario"
          fields={createFields}
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
          title="Editar usuario"
          fields={editFields}
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
