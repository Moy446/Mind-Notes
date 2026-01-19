import React from 'react'
import { useState } from 'react';
import './FooterMenu.css'
import {Link} from 'react-router-dom';

//Logo
import logoBlanco from '../../images/logoCompletoBlanco.png'

export default function FooterMenu(){

    const [activo, setActivo] = useState(false);
    
    const handleClick = () => {
        setActivo(!activo);
    };

    return (
        
        <div className='div-completeFooter'>
            <div className='div-FooterContenedor'>
                <img src={logoBlanco} alt="Descripción de la imagen" className='img-footermenu'/>
                <div className='nav-footermenu'>

                    <div className='one'>
                        <h4>¿Quienes somos?</h4>
                        <p>Somos una herramienta para mejorar el proceso administrativo de los psicólogos
                            con cada uno de los pacientes que atienden.
                        </p>
                        
                    </div>
                    <div className='two'>
                        <ul>
                            <li><a className='a-footermenu'><h4>Mind Notes</h4></a></li>
                            <li><Link to={'/'} className='li-link'>Nosotros</Link></li>
                            <li><Link to={"/ComoFunciona"} className='li-link'>¿Cómo funciona?</Link></li>
                            <li><Link to={"/PlanesGeneral"} className='li-link'>Precios</Link></li>
                            <li><Link to={"/Login"} className='li-link'>Ingresar</Link></li>
                        </ul>    
                    </div>

                    <div className='three'>
                        <ul>
                            <li><a className='a-footermenu'><h4>Legal</h4></a></li>
                            <li><Link to={"/ComoFunciona"} className='li-link'>Privacidad</Link></li>
                            <li><Link to={"/ComoFunciona"} className='li-link'>Terminos y condiciones</Link></li>
                        </ul>
                    </div>

                    <div className='four'>
                        <h4>Contactanos</h4>
                        <form>
                            <ul>
                                <li><input placeholder='Asunto' className= "input-footer" type="text" ></input></li>
                                <li> <input placeholder='Correo' className= "input-footer" type="text" ></input></li>
                                <li><input placeholder='Dudas' className= "input-footer" type="text" ></input></li>
                                <li>
                                    <button className= "btn-enviar">Enviar</button>
                                </li>
                            </ul>
                        </form>
                    </div>
                </div>
            </div>
            <div className='footer-CopyrightElement'>
                <p className='CopyrightElement'>2026 @ Todos los derechos reservados. Mind Notes</p>
                <a href="https://www.facebook.com" className='a-icons'><i className="fa-brands fa-facebook "></i></a>
                <a href="https://www.instagram.com/mindnotes_oficial?igsh=bHM4bGVkY2h5aWhz" className='a-icons'><i className="fa-brands fa-instagram"></i></a>
                <a href="https://www.tiktok.com" className='a-icons'><i className="fa-brands fa-tiktok"></i></a>
            </div>
        </div>
    );
}