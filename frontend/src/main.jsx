import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import {BrowserRouter, Routes, Route} from 'react-router-dom'
import MenuPsiF from './MenuPsiF.jsx'
import ChatPsiF from './ChatPsiF.jsx'
import Doc from './Doc.jsx'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path='/psicologo' element={<MenuPsiF/>}>
          <Route path='chat:id' element={<ChatPsiF/>}/>
          <Route path='doc:id' element={<Doc/>}/>
          <Route path='grabadora' element={<div>Grabadora</div>}/>
          <Route path='calendario' element={<div>Calendario</div>}/>
          <Route path='perfil:id' element={<div>perfil chevere</div>}/>
        </Route>
        <Route path='/' element = {<App/>}/>
      </Routes>
    </BrowserRouter>
  </React.StrictMode>,
)