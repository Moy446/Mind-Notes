import React from 'react'
import { useState } from 'react';
import './FooterMenu.css'

export default function FooterMenu(props){

    const [activo, setActivo] = useState(false);
    
    const handleClick = () => {
        setActivo(!activo);
    };

    return (
            <div className='div-FooterContenedor'>
                <img src={props.img} alt="Descripción de la imagen" className='img-footermenu'/>
                <div className='nav-footermenu'>

                    <div className='one'>
                        <h3>¿Quienes somos?</h3>
                        <p>Somos una herramienta para mejorar el proceso administrativo de los psicólogos
                            con cada uno de los pacientes que atienden.
                        </p>
                        
                    </div>
                    <div className='two'>
                        <ul>
                            <li><a href='#' className='a-footermenu'><h4>Mind Notes</h4></a></li>
                            <li><a href='#' className='a-footermenu'>Inicio</a></li>
                            <li><a href='#' className='a-footermenu'>Nosotros</a></li>
                            <li><a href='#' className='a-footermenu'>¿Cómo funciona?</a></li>
                            <li><a href='#' className='a-footermenu'>Precios</a></li>
                            <li><a href='#' className='a-footermenu'>Ingresar</a></li>
                        </ul>    
                    </div>

                    <div className='three'>
                        <ul>
                            <li><a href='#' className='a-footermenu'><h4>Legal</h4></a></li>
                            <li><a href='#' className='a-footermenu'>Privacidad</a></li>
                            <li><a href='#' className='a-footermenu'>Terminos y condiciones</a></li>
                        </ul>
                    </div>

                    <div className='four'>
                        <h4>Contactanos</h4>
                        <form>
                            <ul>
                                <li><input placeholder='Asunto' class= "input-footer" type="text" ></input></li>
                                <li> <input placeholder='Correo' class= "input-footer" type="text" ></input></li>
                                <li><input placeholder='Dudas' class= "input-footer" type="text" ></input></li>
                                <li>
                                    <button class= "btn-enviar">Enviar</button>
                                </li>
                            </ul>
                        </form>
                    </div>
                </div>  
            </div>
    );
}