import { useState, type FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'

export function HomePage() {
  const [cui, setCui] = useState('20250100')
  const navigate = useNavigate()

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const trimmedCui = cui.trim()

    if (trimmedCui) {
      navigate(`/constancia/${trimmedCui}`)
    }
  }

  return (
    <section className="home-card">
      <h1>Sistema de Matrícula de Laboratorio EPIS</h1>
      <p>Ingrese el C.U.I. del estudiante para generar la constancia.</p>
      <form className="home-form" onSubmit={handleSubmit}>
        <label htmlFor="cui">C.U.I.</label>
        <input
          id="cui"
          name="cui"
          value={cui}
          onChange={(event) => setCui(event.target.value)}
          placeholder="20250100"
        />
        <button type="submit">Ver constancia</button>
      </form>
    </section>
  )
}
