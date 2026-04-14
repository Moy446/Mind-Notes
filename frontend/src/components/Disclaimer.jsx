import React from 'react'
import './Disclaimer.css'

function DisclaimerComponent (props){
    const navigate = props.navigation
    return (
        <div className='FullDisclaimer'>
            <div className="title-container">
                <h2>Disclaimer</h2>
            </div>

            <div className="body-container">
            <p>
                Esta aplicacaion es una herramienta de apoyo para el psicologo para ayudar a mantener la calidad de la informacion durante la sesion psicologica. 
                Cualquier duda o aclaracion no dude en consultarnos y consultar nuestro{" "}

                <span
                className="link"
                onClick={() => navigate("/aviso-privacidad")}
                >
                Aviso de privacidad
                </span>

                {' '}y los{' '}

                <span
                className="link"
                onClick={() => navigate("/terminos-y-condiciones")}
                >
                Términos y condiciones
                </span>

                {' '}de esta aplicacion.
            </p>

            <button
                className="button"
                onClick={() => props.onClick()}
            >
                Aceptar
            </button>
            </div>
        </div>
    )
}

export default DisclaimerComponent