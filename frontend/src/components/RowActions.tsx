interface RowActionsProps {
  onEdit: () => void
  onDelete: () => void
}

export function RowActions({ onEdit, onDelete }: RowActionsProps) {
  return (
    <div className="row-actions">
      <button
        type="button"
        className="icon-btn"
        title="Editar"
        onClick={onEdit}
      >
        ✎
      </button>
      <button
        type="button"
        className="icon-btn danger"
        title="Eliminar"
        onClick={onDelete}
      >
        🗑
      </button>
    </div>
  )
}
