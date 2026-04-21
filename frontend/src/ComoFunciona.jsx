import React from 'react'
import './ComoFunciona.css'
import HeaderMenu from './components/headerAndFooter/HeaderMenu'
import FooterMenu from './components/headerAndFooter/FooterMenu'

//Imagenes
import nosotrosImg from './images/nosotrosImg.png'
import recordatorios from './images/recordatorios.png'
import chat from './images/chat.png'
import herramienta from './images/herramienta.png'
import comoFunciona_img from './images/comoFunciona_img.jpg'


function ComoFunciona() {
    return (
    <div className="ComoFunciona">
        <header className="ComoFunciona-header">
            <HeaderMenu/>
        </header>

        <section className='section-first'>
            <img className= "imgNosotros" src={comoFunciona_img} alt="Imagen" />
            <div className='container'>
                <h3 className='title-text'>¿Cómo funciona?</h3>
                <p className="p-ComoFunciona">
                    Nuestra aplicación funciona con base a una inteligencia artificial que transcribe y analiza lo ocurrido en 
                    una sesión psicologica, clasificando la información en secciones: Vida amorosa, familiar, personal y laboral.
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
                <img className="imgBeneficios" src={herramienta} alt="Imagen" />
            </div>

            <div className='div-secondColum'>
                <h3>Recordatorio</h3>
                <p className="p-colum">
                    Los recordatorios son para el paciente de sus próximas citas y evitar así las faltas o el poder reagendar a tiempo de una manera 
                    más automatizada.
                </p>
                <img className="imgBeneficios" src={recordatorios} alt="Imagen" id='imgRecordatorio'/>
            </div>

            <div className='div-thirdColum'>
                <h3>Aplicacion</h3>
                <p className="p-colum">
                    Tendrá organizado todos los materiales de ayuda que le envía su psicólogo y un chat integrado para poder 
                    comunicarse con él.
                </p>
                <img className="imgBeneficios" src={chat} alt="Imagen" />
            </div>
        </div>

        <footer>
            <FooterMenu/>
        </footer>
    </div>
    )
}

export default ComoFunciona