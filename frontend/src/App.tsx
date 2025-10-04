import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { useAuthStore } from './store/authStore'
import Login from './pages/Login'
import Register from './pages/Register'
import Dashboard from './pages/Dashboard'
import Biens from './pages/Biens'
import Locataires from './pages/Locataires'
import Locations from './pages/Locations'
import Organisations from './pages/Organisations'
import Notes from './pages/Notes'
import Agenda from './pages/Agenda'
import Settings from './pages/Settings'
import Layout from './components/Layout'

function PrivateRoute({ children }: { children: React.ReactNode }) {
  const { token } = useAuthStore()
  return token ? <>{children}</> : <Navigate to="/login" />
}

function App() {
  const { token } = useAuthStore()

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={token ? <Navigate to="/" /> : <Login />} />
        <Route path="/register" element={token ? <Navigate to="/" /> : <Register />} />
        
        <Route path="/" element={
          <PrivateRoute>
            <Layout />
          </PrivateRoute>
        }>
          <Route index element={<Dashboard />} />
          <Route path="biens" element={<Biens />} />
          <Route path="locataires" element={<Locataires />} />
          <Route path="locations" element={<Locations />} />
          <Route path="organisations" element={<Organisations />} />
          <Route path="notes" element={<Notes />} />
          <Route path="agenda" element={<Agenda />} />
          <Route path="settings" element={<Settings />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App
