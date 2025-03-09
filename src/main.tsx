import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { ThemeProvider } from './contexts/ThemeContext.tsx'
import './index.css'
import App from './App.tsx'
import Profile from './components/Profile.tsx'
import Login from './components/Login.tsx'
import Signup from './components/Signup.tsx'
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import NewChatInterface from "./components/NewChatInterface.tsx";
import MainPage from './components/MainPage.tsx'

import { AuthProvider } from './contexts/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
const queryClient = new QueryClient();
createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <ThemeProvider>
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<MainPage/>}/>
              <Route element={<ProtectedRoute />}>
                <Route path="/chat" element={<NewChatInterface />} />
                <Route path="/chat/:chat_id" element={<App />} />
                <Route path="/profile" element={<Profile />} />
              </Route>
              {/* <Route path="/profile" element={<Profile />}>
                <Route path=":proid" element={<Profile />} />
              </Route> */}
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
            </Routes>
          </BrowserRouter>
        </ThemeProvider>
      </AuthProvider>
    </QueryClientProvider>
  </StrictMode>
);
