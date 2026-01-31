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
import Error from './Error.jsx'

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
        <Route path='error:id' element={<Error number={404} desc="Not found"/>}/>
        <Route path='/' element = {<App/>}/>
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
)