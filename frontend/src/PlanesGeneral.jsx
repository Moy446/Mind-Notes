import React, { useState, useEffect } from 'react'
import HeaderMenu from './components/headerAndFooter/HeaderMenu'
import FooterMenu from './components/headerAndFooter/FooterMenu'
import './PlanesGeneral.css'

function PlanesGeneral() {
    return (
        <div className="PlanesGeneral">
        <header className="PlanesGeneral-header">
            <HeaderMenu img = "src/images/logocolor.png" />
        </header>

        <div className='div-planes'>
            <h1>Precios</h1>

            <div className='div-planesGeneral'>
                
                <div className='div-planUno'>
                    <img className="img-planesGeneral" src="src/images/logocolor.png" alt="Imagen"/>
                    <p className='p-duracion'>1 mes</p>
                    <button className= "btn-planesGeneral">USD $10</button>
                </div>

                <div className='div-planDos'>
                    <img className="img-planesGeneral" src="src/images/logocolor.png" alt="Imagen"/>
                    <p className='p-duracion'>6 meses</p>
                    <button className= "btn-planesGeneral">USD $30</button>
                </div>

                <div className='div-planTres'>
                    <img className="img-planesGeneral" src="src/images/logocolor.png" alt="Imagen"/>
                    <p className='p-duracion'>1 año</p>
                    <button className= "btn-planesGeneral">USD $40</button>
                </div>

            </div>
        </div>
        
        <footer>
            <FooterMenu img = "src/images/logoCompletoBlanco.png"/>
        </footer>
        </div>
    )
}

export default PlanesGeneral