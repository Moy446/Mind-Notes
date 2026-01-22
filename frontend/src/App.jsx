import React from 'react'
import HeaderMenu from './components/headerAndFooter/HeaderMenu'
import FooterMenu from './components/headerAndFooter/FooterMenu'
import './App.css'

// Imágenes
import nosotrosImg from './images/nosotrosImg.png'

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <HeaderMenu />
      </header>

      <section className="first">
        <div className="container">
          <h3 className="title-App">¿Qué es Mind Notes?</h3>
          <p className="p-QueEsMindNotes">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. 
            Ut enim ad minim veniam, quis nostrud exercitation.
          </p>
        </div>

        <img
          className="imgNosotros"
          src={nosotrosImg}
          alt="Imagen Nosotros"
        />
      </section>

      <div className="separator"></div>

      <section className="second">
        <img
          className="imgMision"
          src={nosotrosImg}
          alt="Imagen Misión"
        />

        <div>
          <h3>Misión</h3>
          <p className="p-Mision">
            La misión de Mind Notes, es optimizar el tiempo de realización de los reportes manteniendo la calidad de la información 
            entre cada sesión psicológica a través de una aplicación donde el psicólogo puede personalizar su reporte y pueda mantener 
            una mejor organización con todos sus pacientes para que puedan brindarles la mejor atención.
            </p>
        </div>
      </section>

      <section className="third">
        <h3>Visión</h3>
        <p>
          Ser la aplicación líder en gestión y optimización de reportes para psicólogos en México, apoyando a la mayoría de especialidades
          de psicólogos con funciones variadas para la personalización y optimización al realizar reportes de sus pacientes.    
        </p>
      </section>

      <footer>
        <FooterMenu/>
      </footer>
    </div>
  )
}

export default App