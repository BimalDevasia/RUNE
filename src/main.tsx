import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router'
import { ThemeProvider } from './contexts/ThemeContext.tsx'
import './index.css'
import App from './App.tsx'
import Profile from './components/Profile.tsx'
import Login from './components/Login.tsx'
import Signup from './components/Signup.tsx'
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import NewChatInterface from "./components/NewChatInterface.tsx";


const queryClient = new QueryClient();
createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<NewChatInterface />} />
            <Route path="/chat/:chat_id" element={<App />} />
            <Route path="/profile" element={<Profile />}>
              <Route path=":proid" element={<Profile />} />
            </Route>
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
          </Routes>
        </BrowserRouter>
      </ThemeProvider>
    </QueryClientProvider>
  </StrictMode>
);
