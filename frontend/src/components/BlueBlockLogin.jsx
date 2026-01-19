import React, { useState } from 'react';

export default function HeaderMenu(props) {
    const [activo, setActivo] = useState(false);

    return (
        <div className="div-bluleBlock">
            <p className='title-block'>¡Hola, bienvenido!</p>
            <p>¿Aún no tienes cuenta?</p>
            <button></button>
        </div>
    );
}
