import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { CertificatePage } from './pages/CertificatePage'
import { HomePage } from './pages/HomePage'
import './App.css'

function App() {
  return (
    <BrowserRouter>
      <main className="app-shell">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/constancia/:cui" element={<CertificatePage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
    </BrowserRouter>
  )
}

export default App
