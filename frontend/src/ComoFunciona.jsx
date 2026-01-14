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
            <h3>¿Qué es Mind Notes?</h3>
            <p className="p-QueEsMindNotes">Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation 
            </p>
            <img className= "imgNosotros" src="src/images/nosotrosImg.png" alt="Imagen" />
        </section>

        <div className='separator-ComoFunciona'></div>

        <footer>
            <FooterMenu img = "src/images/logoCompletoBlanco.png"/>
        </footer>
    </div>
    )
}

export default ComoFunciona