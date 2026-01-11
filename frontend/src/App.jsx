import React, { useState, useEffect } from 'react'
import './App.css'
import HeaderMenu from './components/headerAndFooter/HeaderMenu'
import { getNotes, createNote } from './services/api'
import FooterMenu from './components/headerAndFooter/FooterMenu'

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <HeaderMenu img = "src/images/logocolor.png" />
      </header>

      <section className='first'>
        <h3>¿Qué es Mind Notes?</h3>
        <p className="p-QueEsMindNotes">Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation 
        </p>
        <img className= "imgNosotros" src="src/images/nosotrosImg.png" alt="Imagen" />
      </section>

      <div className='separator'></div>

      <section className='second'>
        <h3>Mision</h3>
        <p className="p-Mision">La misión de Mind Notes, es optimizar el tiempo de realización de los reportes manteniendo la calidad de la información entre cada sesión psicológica a través de una aplicación donde el psicólogo puede personalizar su reporte y pueda mantener una mejor organización con todos sus pacientes para que puedan brindarles la mejor atención.
        </p>
        <img className="imgMision" src="src/images/nosotrosImg.png" alt="Imagen" />
      </section>

      <section className='third'>
        <h3>Vision</h3>
        <p>Ser la aplicación líder en gestión y optimización de reportes para psicólogos en México, apoyando a la mayoría de especialidades de psicólogos con funciones variadas para la personalización y optimización al realizar reportes de sus pacientes</p>
      </section>

      <footer>
        <FooterMenu img = "src/images/logoCompletoBlanco.png"/>
      </footer>
    </div>
  )
}

export default App