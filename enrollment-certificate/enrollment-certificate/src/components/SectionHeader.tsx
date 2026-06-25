interface SectionHeaderProps {
  title: string
}

export function SectionHeader({ title }: SectionHeaderProps) {
  return (
    <div className="section-header">
      <span className="section-accent" />
      <h2>{title}</h2>
    </div>
  )
}
