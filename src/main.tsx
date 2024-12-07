import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter,Routes, Route } from 'react-router'
import './index.css'
import App from './App.tsx'
import Profile from './components/Profile.tsx'

createRoot(document.getElementById('root')!).render(

  <StrictMode>
    <BrowserRouter>
    <Routes>
      <Route path="/" element={<App />} />
      <Route path="/profile" element={<Profile />} >
        <Route path=":proid" element={<Profile/>}/>
      </Route>
    </Routes>
    
    </BrowserRouter>
  </StrictMode>,
)