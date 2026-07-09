interface SearchBarProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
}

export function SearchBar({ value, onChange, placeholder }: SearchBarProps) {
  return (
    <input
      type="search"
      className="search-bar"
      value={value}
      placeholder={placeholder ?? 'Buscar…'}
      onChange={(event) => onChange(event.target.value)}
    />
  )
}
