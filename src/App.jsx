import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import MainPage from "./pages/MainPage.jsx"
import Login from "./pages/Login"
import Signup from "./pages/Signup"
import Dashboard from "./pages/Dashboard/Dashboard"
import EventDetail from "./pages/EventDetail"
import ProtectedRoute from './pages/ProtectedRoute'
import { MyContext } from "./components/context/MyContext"
import { useState } from "react"

export default function App() {

  const [eventsList, setEventsList] = useState([]) 

  return (
    <MyContext.Provider value={{ eventsList, setEventsList }}>
    <Router>
      <Routes>
        <Route element={
        <ProtectedRoute>
          <MainPage />
        </ProtectedRoute>
        } path="/" exact />

        <Route element={
        <ProtectedRoute>
          <EventDetail />
        </ProtectedRoute>
        } path="/event-detail/:id" exact />

        <Route element={<Login />} path="/login" exact />
        <Route element={<Signup />} path="/signup" exact />

        <Route element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        } path="/dashboard" exact />
      </Routes>
    </Router>
    </MyContext.Provider>
  )
}
