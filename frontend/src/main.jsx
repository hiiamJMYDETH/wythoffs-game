import { StrictMode } from 'react'
<<<<<<< HEAD
import { BrowserRouter } from 'react-router-dom'
import { createRoot } from 'react-dom/client'
import './styles/index.css'
=======
import {BrowserRouter} from 'react-router-dom'
import { createRoot } from 'react-dom/client'
>>>>>>> efa72369a7cb309458e0731b7ff74db918251236
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>,
)
