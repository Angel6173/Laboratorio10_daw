import { useState } from 'react'
import type { Column } from '../components/DataTable'
import { ResourceView } from '../components/ResourceView'
import { StatusBadge } from '../components/StatusBadge'
import {
  CreateResourceModal,
  type FormFieldDef,
} from '../components/CreateResourceModal'
import { useTeachers } from '../hooks/useResources'
import { useCreateTeacher } from '../hooks/useMutations'
import type { Teacher } from '../types/models'

const columns: Column<Teacher>[] = [
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
  { key: 'gender', header: 'Género', render: (teacher) => teacher.gender ?? '—' },
  {
    key: 'status',
    header: 'Estado',
    render: (teacher) => <StatusBadge status={teacher.status} />,
  },
]

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
]

export function TeachersPage() {
  const [open, setOpen] = useState(false)
  const create = useCreateTeacher()

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
        <button className="btn-primary" onClick={() => setOpen(true)}>
          + Nuevo docente
        </button>
      </div>
      <ResourceView
        title="DOCENTES"
        query={useTeachers()}
        columns={columns}
        rowKey={(teacher) => teacher.id}
      />
      {open && (
        <CreateResourceModal
          title="Nuevo docente"
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
