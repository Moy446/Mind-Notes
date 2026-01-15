import React, { useState, useEffect } from 'react'
import './ComoFunciona.css'
import HeaderMenu from './components/headerAndFooter/HeaderMenu'
import FooterMenu from './components/headerAndFooter/FooterMenu'

function ComoFunciona() {
    return (
    <div className="ComoFunciona">
        <header className="ComoFunciona-header">
            <HeaderMenu img = "src/images/logocolor.png" />
        </header>

        <section className='section-first'>
            <img className= "imgNosotros" src="src/images/nosotrosImg.png" alt="Imagen" />
            <div className='container'>
                <h3 className='title-text'>¿Cómo funciona?</h3>
                <p className="p-QueEsMindNotes">
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation 
                </p>
            </div>
            
        </section>

        <div className='separator-ComoFunciona'></div>

        <h2>Beneficios</h2>

        <div className='div-colum'>
            <div className='div-firstColum'>
                <h3>Herramienta</h3>
                <p className="p-colum">
                    Realizara resúmenes de la sesión, además identificará los puntos abordados.
                </p>
                <img className="imgMision" src="src/images/nosotrosImg.png" alt="Imagen" />
            </div>

            <div className='div-secondColum'>
                <h3>Recordatorio</h3>
                <p className="p-colum">
                    Para el paciente de sus próximas citas y evitar así las faltas o el poder reagendar a tiempo de una manera más automatizada.
                </p>
                <img className="imgMision" src="src/images/nosotrosImg.png" alt="Imagen" />
            </div>

            <div className='div-thirdColum'>
                <h3>Aplicacion</h3>
                <p className="p-colum">
                    Tendrá organizado todos los materiales de ayuda que le envía su psicólogo y un chat integrado para poder comunicarse con él.
                </p>
                <img className="imgMision" src="src/images/nosotrosImg.png" alt="Imagen" />
            </div>
        </div>

        <footer>
            <FooterMenu img = "src/images/logoCompletoBlanco.png"/>
        </footer>
    </div>
    )
}

export default ComoFunciona