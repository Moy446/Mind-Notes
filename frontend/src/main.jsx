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
import CalendarioF from './CalenndarioF.jsx'
import MenuPaF from './MenuPaF.jsx'
import PerfilPaF from './PerfilPaF.jsx'
import ChatPaF from './ChatPaF.jsx'

import ComoFunciona from './ComoFunciona.jsx'
import PlanesGeneral from './PlanesGeneral.jsx'
import Login from './login.jsx'
import ReestablecerPassword from './ReestablecerPassword.jsx'


ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path='/psicologo' element={<MenuPsiF/>}>
          <Route path='chat:id' element={<ChatPsiF/>}/>
          <Route path='doc:id' element={<Doc/>}/>
          <Route path='grabadora' element={<Grabadora/>}/>
          <Route path='calendario' element={<CalendarioF/>}/>
          <Route path='perfil:id' element={<PerfilPsiF/>}/>
          <Route path='planes' element={<Planes/>}/>
        </Route>
        <Route path='/paciente' element={<MenuPaF/>}>
          <Route path='chat:id' element={<ChatPaF/>}/>
          <Route path='perfil:id' element={<PerfilPaF/>}/>
        </Route>
        <Route path='/' element = {<App/>}/>
        <Route path="/ComoFunciona" element={<ComoFunciona/>} />
        <Route path='/PlanesGeneral' element={<PlanesGeneral/>}/>
        <Route path='/Login' element={<Login/>}/>
        <Route path='/ReestablecerPassword' element={<ReestablecerPassword/>}/>
        <Route path='/pruebas' element = {<componentsPruebas/>}/>
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
)