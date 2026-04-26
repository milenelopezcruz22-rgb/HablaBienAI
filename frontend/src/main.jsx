import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import Navbar from './components/navbar.jsx'
import Inicio from './pages/Inicio.jsx'

createRoot(document.getElementById('root')).render(
    <StrictMode>
        <Navbar />
        <Inicio />
    </StrictMode>,
)