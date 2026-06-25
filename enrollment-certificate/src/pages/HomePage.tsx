import { useState, type FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export function HomePage() {
  const [studentId, setStudentId] = useState('')
  const navigate = useNavigate()
  const { logout } = useAuth()

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const trimmed = studentId.trim()
    if (trimmed) {
      navigate(`/constancia/${trimmed}`)
    }
  }

  return (
    <section className="home-card">
      <div className="home-header">
        <h1>Sistema de Matrícula de Laboratorio EPIS</h1>
        <button className="logout-btn" onClick={logout} type="button">
          Cerrar sesión
        </button>
      </div>
      <p>Ingrese el ID del estudiante (UUID) para generar la constancia de matrícula.</p>
      <form className="home-form" onSubmit={handleSubmit}>
        <label htmlFor="studentId">ID del Estudiante</label>
        <input
          id="studentId"
          name="studentId"
          value={studentId}
          onChange={(event) => setStudentId(event.target.value)}
          placeholder="xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
        />
        <button type="submit">Ver constancia</button>
      </form>
    </section>
  )
}
