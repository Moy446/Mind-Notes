import React, { useState, useCallback } from 'react'
import './Planes.css'
import SubBtn from './components/SubBtn';
import EliminarBtn from './components/EliminarBtn';

export default function PerfilPsiF(props) {

    return (
        <div className="planes">
            <div>
                Planes
            </div>
            <div className='plaBtns'>
                <SubBtn time="30 Días" price="Gratis" des="Contratar prueba gratuita" />
                <SubBtn time="1 Mes" price="USD$10" des="Contratar plan mensual" />
                <SubBtn time="6 Meses" price="USD$30" des="Contratar plan semestral" />
                <SubBtn time="1 Año" price="USD$40" des="Contratar  plan anual" />
            </div>
            <div className='cancelSubBtn'>
                <EliminarBtn texto = "Cancelar suscripccion"/>
            </div>
        </div>
    );
}