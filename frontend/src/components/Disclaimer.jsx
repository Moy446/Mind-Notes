import React from 'react'
import './Disclaimer.css'

function DisclaimerComponent (props){
    const navigate = props.navigation
    return (
        <div className='FullDisclaimer'>
            <div className="title-container">
                <h2>Aviso</h2>
            </div>

            <div className="body-container">
            <p>
                Esta aplicación es una herramienta de apoyo para el psicólogo para ayudar a mantener la calidad de la información durante la sesión psicológica. 
                Cualquier duda o aclaración no dude en consultarnos y consultar nuestro{" "}

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

                {' '}de esta aplicación.
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