import { useState } from 'react'
import type { Column } from '../components/DataTable'
import { ResourceView } from '../components/ResourceView'
import { StatusBadge } from '../components/StatusBadge'
import { SearchBar } from '../components/SearchBar'
import {
  CreateResourceModal,
  type FormFieldDef,
} from '../components/CreateResourceModal'
import { useUsers } from '../hooks/useResources'
import { useDebounce } from '../hooks/useDebounce'
import { useCreateUser } from '../hooks/useMutations'
import type { User } from '../types/models'

const columns: Column<User>[] = [
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
  {
    key: 'created',
    header: 'Creado',
    render: (user) => new Date(user.created).toLocaleDateString('es-PE'),
  },
]

const fields: FormFieldDef[] = [
  { name: 'email', label: 'Email', type: 'email', required: true },
  { name: 'password', label: 'Contraseña', type: 'password', required: true },
  {
    name: 'role',
    label: 'Rol',
    type: 'select',
    required: true,
    options: [
      { value: 'admin', label: 'Admin' },
      { value: 'teacher', label: 'Docente' },
      { value: 'student', label: 'Estudiante' },
    ],
  },
  {
    name: 'status',
    label: 'Estado',
    type: 'select',
    options: [
      { value: 'active', label: 'Activo' },
      { value: 'inactive', label: 'Inactivo' },
      { value: 'suspended', label: 'Suspendido' },
    ],
  },
]

export function UsersPage() {
  const [search, setSearch] = useState('')
  const [open, setOpen] = useState(false)
  const create = useCreateUser()
  const query = useUsers(useDebounce(search))

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
          placeholder="Buscar por email…"
        />
        <button className="btn-primary" onClick={() => setOpen(true)}>
          + Nuevo usuario
        </button>
      </div>
      <ResourceView
        title="USUARIOS"
        query={query}
        columns={columns}
        rowKey={(user) => user.id}
      />
      {open && (
        <CreateResourceModal
          title="Nuevo usuario"
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
