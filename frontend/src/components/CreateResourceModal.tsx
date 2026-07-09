import { useState, type FormEvent } from 'react'

export interface FormFieldDef {
  name: string
  label: string
  type?: 'text' | 'number' | 'select' | 'password' | 'email'
  required?: boolean
  placeholder?: string
  options?: { value: string; label: string }[]
}

interface CreateResourceModalProps {
  title: string
  fields: FormFieldDef[]
  isPending: boolean
  error: Error | null
  onClose: () => void
  onSubmit: (data: Record<string, string>) => void
}

export function CreateResourceModal({
  title,
  fields,
  isPending,
  error,
  onClose,
  onSubmit,
}: CreateResourceModalProps) {
  const [values, setValues] = useState<Record<string, string>>({})

  function setField(name: string, value: string) {
    setValues((prev) => ({ ...prev, [name]: value }))
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const cleaned = Object.fromEntries(
      Object.entries(values).filter(([, value]) => value !== ''),
    )
    onSubmit(cleaned)
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-card" onClick={(event) => event.stopPropagation()}>
        <div className="modal-header">
          <h2>{title}</h2>
          <button type="button" className="modal-close" onClick={onClose}>
            ×
          </button>
        </div>

        <form className="modal-body" onSubmit={handleSubmit}>
          {fields.map((field) => (
            <div className="form-field" key={field.name}>
              <label>
                {field.label}
                {field.required && <span className="req"> *</span>}
              </label>
              {field.type === 'select' ? (
                <select
                  value={values[field.name] ?? ''}
                  required={field.required}
                  onChange={(event) => setField(field.name, event.target.value)}
                >
                  <option value="">— Selecciona —</option>
                  {field.options?.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              ) : (
                <input
                  type={field.type ?? 'text'}
                  value={values[field.name] ?? ''}
                  placeholder={field.placeholder}
                  required={field.required}
                  onChange={(event) => setField(field.name, event.target.value)}
                />
              )}
            </div>
          ))}

          {error && <p className="form-error">{error.message}</p>}

          <div className="modal-actions">
            <button type="button" className="btn-secondary" onClick={onClose}>
              Cancelar
            </button>
            <button type="submit" className="btn-primary" disabled={isPending}>
              {isPending ? 'Guardando…' : 'Guardar'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
