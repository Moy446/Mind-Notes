import React from 'react'
import { useState } from 'react';
import './HeaderMenu.css'

export default function HeaderMenu(props){

    const [activo, setActivo] = useState(false);
    
    const handleClick = () => {
        setActivo(!activo);
    };

    return (
            <div className='div-HeaderContenedor'>
                <img src={props.img} alt="Descripción de la imagen" className='img-headermenu'/>
                <nav className='nav-headermenu'>
                    
                    <a href='#' className='a-headermenu'>Nosotros</a>
                    <a href='#' className='a-headermenu'>¿Cómo funciona?</a>
                    <a href='#' className='a-headermenu'>Precios</a>
                    <a href='#' className='a-headermenu'>Ingresar</a>
                </nav>  
            </div>
    );
}