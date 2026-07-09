import { useState } from 'react'
import { Link } from 'react-router-dom'
import type { Column } from '../components/DataTable'
import { ResourceView } from '../components/ResourceView'
import { StatusBadge } from '../components/StatusBadge'
import { SearchBar } from '../components/SearchBar'
import {
  CreateResourceModal,
  type FormFieldDef,
} from '../components/CreateResourceModal'
import { useStudents, useUsers } from '../hooks/useResources'
import { useDebounce } from '../hooks/useDebounce'
import { useCreateStudent } from '../hooks/useMutations'
import type { Student } from '../types/models'

const columns: Column<Student>[] = [
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
    key: 'address',
    header: 'Dirección',
    render: (student) => student.address ?? '—',
  },
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

export function StudentsPage() {
  const [search, setSearch] = useState('')
  const [open, setOpen] = useState(false)
  const create = useCreateStudent()
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
          placeholder="Buscar por nombre o apellido…"
        />
        <button className="btn-primary" onClick={() => setOpen(true)}>
          + Nuevo estudiante
        </button>
      </div>
      <ResourceView
        title="ESTUDIANTES"
        query={query}
        columns={columns}
        rowKey={(student) => student.id}
      />
      {open && (
        <CreateResourceModal
          title="Nuevo estudiante"
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
