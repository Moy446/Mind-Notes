import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import {BrowserRouter, Routes, Route} from 'react-router-dom'
import MenuPsiF from './MenuPsiF.jsx'
import ChatPsiF from './ChatPsiF.jsx'

import Doc from './Doc.jsx'
import Grabadora from './Grabadora.jsx'
import PerfilPsiF from './PerfilPsiF.jsx'
import Planes from './Planes.jsx'
import Calendario from './Calendario.jsx'
import MenuPaF from './MenuPaF.jsx'
import PerfilPaF from './PerfilPaF.jsx'
import ChatPaF from './ChatPaF.jsx'
import Error from './Error.jsx'

import ComoFunciona from './ComoFunciona.jsx'
import PlanesGeneral from './PlanesGeneral.jsx'
import Login from './login.jsx'
import { AuthProvider } from './context/AuthContext.jsx'
import ReestablecerPassword from './ReestablecerPassword.jsx'
import VerificarCuenta from './VerificarCuenta.jsx'
import ProtectedRoute from './components/ProtectedRoute.jsx'
import GoogleCallback from './GoogleCallback.jsx'
import ConfirmarCita from './confirmarCita.jsx'

import { GoogleOAuthProvider } from '@react-oauth/google';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>
    <AuthProvider>
      <BrowserRouter>
      <Routes>
          {/*-- Rutas protegidas para psicólogos --*/}
        <Route path='/psicologo' element={<ProtectedRoute requiredRole="psicologo"><MenuPsiF/></ProtectedRoute>}>
          <Route path='chat/:id' element={<ChatPsiF/>}/>
          <Route path='doc/:id' element={<Doc/>}/>
          <Route path='grabadora' element={<Grabadora/>}/>
          <Route path='calendario' element={<Calendario/>}/>
          <Route path='perfil' element={<PerfilPsiF/>}/>
          <Route path='planes' element={<Planes/>}/>
        </Route>
        {/*-- Rutas protegidas para pacientes --*/}
        <Route path='/paciente' element={<ProtectedRoute requiredRole="paciente"><MenuPaF/></ProtectedRoute>}>
          <Route path='chat/:id' element={<ChatPaF/>}/>
          <Route path='calendario' element={<Calendario/>}/>
          <Route path='perfil/:id' element={<PerfilPaF/>}/>
          <Route path='chat:id' element={<ChatPaF/>}/>
          <Route path='perfil:id' element={<PerfilPaF/>}/>
        </Route>
        {/*-- Rutas públicas --*/}
        <Route path='error:id' element={<Error number={404} desc="Not found"/>}/>
        <Route path='/' element = {<App/>}/>
        <Route path="/ComoFunciona" element={<ComoFunciona/>} />
        <Route path='/PlanesGeneral' element={<PlanesGeneral/>}/>
        <Route path='/Login' element={<Login/>}/>
        <Route path='/ReestablecerPassword' element={<ReestablecerPassword/>}/>
        <Route path='/pruebas' element = {<componentsPruebas/>}/>
        <Route path="/verificar-cuenta/:token" element={<VerificarCuenta />} />
        <Route path="/resetear-password/:token" element={<ReestablecerPassword />} />
        <Route path="/dashboard" element={<GoogleCallback />} />
        <Route path="/confirmar-cita/:id" element={<ConfirmarCita />} />
      </Routes>
      </BrowserRouter>
    </AuthProvider>
    </GoogleOAuthProvider>
  </React.StrictMode>
)