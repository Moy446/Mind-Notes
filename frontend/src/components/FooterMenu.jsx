import React from 'react'
import { useState } from 'react';
import './FooterMenu.css'


export default function FooterMenu(props){

    const [activo, setActivo] = useState(false);
    
    const handleClick = () => {
        setActivo(!activo);
    };

    return (
        
        <div className='div-completeFooter'>
            <div className='div-FooterContenedor'>
                <img src={props.img} alt="Descripción de la imagen" className='img-footermenu'/>
                <div className='nav-footermenu'>

                    <div className='one'>
                        <h4>¿Quienes somos?</h4>
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
            <div className='footer-CopyrightElement'>
                <p class='CopyrightElement'>2026 @ Todos los derechos reservados. Mind Notes</p>
                <a href="https://www.facebook.com" className='a-icons'><i class="fa-brands fa-facebook "></i></a>
                <a href="https://www.instagram.com/mindnotes_oficial?igsh=bHM4bGVkY2h5aWhz" className='a-icons'><i class="fa-brands fa-instagram"></i></a>
                <a href="https://www.tiktok.com" className='a-icons'><i class="fa-brands fa-tiktok"></i></a>
            </div>
        </div>
    );
}